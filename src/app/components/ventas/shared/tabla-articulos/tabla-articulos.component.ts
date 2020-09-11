import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import Swal from 'sweetalert2';

import { DocumentLines } from 'src/app/models/marketing';
import { Item } from 'src/app/models/masterData';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-tabla-articulos',
  templateUrl: './tabla-articulos.component.html',
  styleUrls: ['./tabla-articulos.component.css']
})
export class TablaArticulosComponent implements OnInit {
  @ViewChild('agGridC', {static: true}) agGridC: AgGridAngular;

  columnDefs = [
      {headerName: '#', valueGetter: 'node.rowIndex + 1' , maxWidth: '60'},
      {headerName: 'Codigo', field: 'ItemCode', maxWidth: '150', minWidth: '50' },
      {headerName: 'Nombre', field: 'ItemName', maxWidth: '250', minWidth: '100' },
      {headerName: 'Cantidad', field: 'Quantity', maxWidth: '100', minWidth: '70', cellStyle: {textAlign: 'center'}, editable: true, 'type': 'numericColumn', valueSetter: this.cellValidate},
      {headerName: 'Precio', field: 'Price', maxWidth: '150', minWidth: '110', cellStyle: {textAlign: 'center'}, cellRenderer: this.CurrencyCellRendererUSD, cellClass: 'grid-cell-centered' },
      {headerName: 'UM', field: 'SalUnitMsr', maxWidth: '50', minWidth: '70', cellStyle: {textAlign: 'center'}},
      {headerName: 'Descuento', field: 'Discount', maxWidth: '70', minWidth: '110', cellStyle: {textAlign: 'center'}},
      {headerName: 'Importe', field: 'Importe', maxWidth: '70', minWidth: '120', cellStyle: {textAlign: 'center'}, cellRenderer: this.CurrencyCellRendererUSD, valueGetter: this.importeValueGetter },
      {headerName: 'Total', field: 'Total', maxWidth: '100', minWidth: '150', cellStyle: {textAlign: 'center'}, cellRenderer: this.CurrencyCellRendererUSD, valueGetter: this.totalValueGetter}
  ];
  rowDataCot = [];
  pageSize = 10;
  quickSearchValue = '';
  item: Item;
  subscription: Subscription;


  constructor(
    private sharedService: SharedService,
    private auth: AuthService,
  ) {
     this.subscription = this.sharedService.sharedMessage.subscribe( response => {
      if (response !== null) {
       if (this.agGridC !== undefined) {
         this.agGridC.api.updateRowData({add: [ this.buildRows(response) ]});
        }
      }
    });
  }

  ngOnInit() {
  }


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
          Importe: ImpoImpus,
          Total: (PrConDesc + ImpoImpus)
    };
    this.rowDataCot.push(value);
    return value;
  }

  onPageSizeChanged(newPageSize) {
    this.agGridC.api.paginationSetPageSize(newPageSize);
  }

  onQuickFilterChanged() {
    this.agGridC.api.setQuickFilter(this.quickSearchValue);
  }

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

  totalSum(params: any) {
    console.log('>',params);
    const inf = this.auth.getDataToken();
    const desc = (100 - Number.parseFloat(inf.PDescuento)) / 100;
    const PrConDesc = desc * params.data.Price;
    const ImpoImpus = 0.16 * PrConDesc * params.data.Quantity;
    params.data.Total = (PrConDesc + ImpoImpus);
  }

  onCellValueChanged(event) {
    /* console.log(event);
    this.totalSum(event); */
    // handle the rest here
  }

}
