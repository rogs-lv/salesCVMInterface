import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { AgGridAngular, AgGridColumn } from 'ag-grid-angular';
import Swal from 'sweetalert2';

import { Item } from 'src/app/models/masterData';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';


@Component({
  selector: 'app-tabla-articulos',
  templateUrl: './tabla-articulos.component.html',
  styleUrls: ['./tabla-articulos.component.css']
})
export class TablaArticulosComponent implements OnInit {

  constructor(
    private sharedService: SharedService,
    private auth: AuthService,
  ) {
     this.subscription = this.sharedService.sharedMessage.subscribe( response => {
      if (response !== null) {
       if (this.agGridC !== undefined) {
         this.agGridC.api.applyTransaction({add: [ this.buildRows(response) ]});
         this.getAllRows();
       }
      }
    });
  }
  @ViewChild('agGridC', {static: true}) agGridC: AgGridAngular;
  @Input()
  rowDataCot = [];
  @Output() rowDataCotEmit = new EventEmitter<any>();


  pageSize = 10;
  quickSearchValue = '';
  item: Item;
  subscription: Subscription;
  rowSelection = 'multiple';
  totalDocumento: number;

  columnDefs = [
      {headerName: '#', valueGetter: 'node.rowIndex + 1' , maxWidth: '60'},
      {headerName: 'Codigo', field: 'ItemCode', maxWidth: '150', minWidth: '50' },
      {headerName: 'Nombre', field: 'ItemName', maxWidth: '250', minWidth: '100' },
      {headerName: 'Cantidad', field: 'Quantity', maxWidth: '100', minWidth: '70', cellStyle: {textAlign: 'center'}, editable: true, 'type': 'numericColumn', valueSetter: this.cellValidate},
      {headerName: 'Precio', field: 'Price', maxWidth: '150', minWidth: '110', cellStyle: {textAlign: 'center'}, cellRenderer: this.CurrencyCellRendererUSD, cellClass: 'grid-cell-centered' },
      {headerName: 'UM', field: 'SalUnitMsr', maxWidth: '50', minWidth: '70', cellStyle: {textAlign: 'center'}},
      {headerName: 'Almacén', field: 'WhsCode', maxWidth: '100', minWidth: '70', cellStyle: {textAlign: 'center'}, hide: true},
      {headerName: 'Impuesto', field: 'TaxCode', maxWidth: '100', minWidth: '70', cellStyle: {textAlign: 'center'}, hide: true},
      {headerName: 'Descuento', field: 'Discount', maxWidth: '70', minWidth: '110', cellStyle: {textAlign: 'center'}},
      {headerName: 'Importe', field: 'Importe', maxWidth: '70', minWidth: '120', cellStyle: {textAlign: 'center'}, cellRenderer: this.CurrencyCellRendererUSD, valueGetter: this.importeValueGetter },
      {headerName: 'Total', field: 'Total', maxWidth: '100', minWidth: '150', cellStyle: {textAlign: 'center'}, cellRenderer: this.CurrencyCellRendererUSD, valueGetter: this.totalValueGetter}
  ];

  ngOnInit() {
  }
  // construcción de registros
  private buildRows(data: Item) {
    const inf = this.auth.getDataToken();
    const desc = (100 - Number.parseFloat(inf.PDescuento)) / 100;
    const PrConDesc = desc * data.Price;
    const ImpoImpus = 0.16 * PrConDesc * 1;

    const value = {
          DocEntry: 0,
          ItemCode: data.ItemCode,
          ItemName: data.ItemName,
          Quantity: 1,
          Price: data.Price,
          SalUnitMsr : data.SalUnitMsr,
          Discount: Number.parseFloat(inf.PDescuento),
          WhsCode: data.WhsCode,
          TaxCode: data.TaxCode,
          Currency: '',
          Importe: ImpoImpus,
          Total: (PrConDesc + ImpoImpus)
    };
    this.rowDataCot.push(value);
    this.rowDataCotEmit.emit(this.rowDataCot);
    return value;
  }
  // Cada que cambien el paginado
  onPageSizeChanged(newPageSize) {
    this.agGridC.api.paginationSetPageSize(newPageSize);
  }
  // cuando realizan una busqueda
  onQuickFilterChanged() {
    this.agGridC.api.setQuickFilter(this.quickSearchValue);
  }
  // Formato de moneda
  CurrencyCellRendererUSD(params: any) {
    const inrFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
    return inrFormat.format(params.value);
  }

  importeValueGetter(params: any) {
    const desc = (100 - Number.parseFloat(params.data.Discount)) / 100;
    const PrConDesc = desc * params.data.Price;
    params.data.Importe = 0.16 * PrConDesc * params.data.Quantity;
    return params.data.Importe;
  }

  totalValueGetter(params: any) {
    const desc = (100 - Number.parseFloat(params.data.Discount)) / 100;
    const PrConDesc = (desc * params.data.Price) * params.data.Quantity;
    params.data.Total = (PrConDesc + params.data.Importe);
    return params.data.Total;
  }
  // validación de celda cantidad
  cellValidate(params: any) {
    const regexp = new RegExp('^[1-9]\d{0,2}$');
    let test = regexp.test(params.newValue);
    if (test === false) {
      params.data.Quantity = Number (params.oldValue);
      return true;
    } else {
      params.data.Quantity = Number (params.newValue);
      return true;
    }
  }
  // Detectamos el cambio en la celda de cantidad
  onCellValueChanged(event) {
    this.getAllRows();
  }

  onRemoveSelected() {
    const selectedData = this.agGridC.api.getSelectedRows();
    const res = this.agGridC.api.applyTransaction({ remove: selectedData });

    let temp = this.rowDataCot.filter((el) => {
      return selectedData.indexOf(el) < 0;
    });
    this.rowDataCot = temp;
    this.rowDataCotEmit.emit(this.rowDataCot);
    this.getAllRows();
  }

  private getAllRows() {
    let infor = [];
    this.agGridC.api.forEachNode(node => infor.push(node.data.Total));
    let result = infor.reduce((a, b) => a + b, 0 );
    this.totalDocumento = result;
    /* return infor; */
  }
}
