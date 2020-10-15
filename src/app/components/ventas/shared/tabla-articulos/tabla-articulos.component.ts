import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { AgGridAngular, AgGridColumn } from 'ag-grid-angular';
import Swal from 'sweetalert2';
import { ToastService } from 'src/app/services/toasts/toast.service';

import { Item } from 'src/app/models/masterData';
import { SharedService } from 'src/app/services/shared/shared.service';
import { interval, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/authentication/auth.service';


@Component({
  selector: 'app-tabla-articulos',
  templateUrl: './tabla-articulos.component.html',
  styleUrls: ['./tabla-articulos.component.css']
})
export class TablaArticulosComponent implements OnInit, OnDestroy {
  @ViewChild('agGridC', {static: false}) agGridC: AgGridAngular;
  @Input() rowDataCot = [];
  @Output() rowDataCotEmit = new EventEmitter<any>();


  pageSize = 10;
  quickSearchValue = '';
  item: Item;
  subscription: Subscription;
  rowSelection = 'multiple';
  totalDocumento: number;
  subTotalDocumento: number;
  totalImpuesto: number;
  descuentoMax = 0.0;

  columnDefs = [
      {headerName: '#', valueGetter: 'node.rowIndex + 1' , maxWidth: '60'},
      {headerName: 'Codigo', field: 'ItemCode', maxWidth: '150', minWidth: '50' },
      {headerName: 'Nombre', field: 'ItemName', maxWidth: '250', minWidth: '100' },
      {headerName: 'Cantidad', field: 'Quantity', maxWidth: '100', minWidth: '70', cellStyle: {textAlign: 'center'}, editable: true, type: 'numericColumn', valueSetter: this.cellValidate.bind(this)},
      {headerName: 'Precio', field: 'Price', maxWidth: '150', minWidth: '110', cellStyle: {textAlign: 'center'}, cellRenderer: this.CurrencyCellRendererUSD, cellClass: 'grid-cell-centered', valueSetter: this.ValidPriceChange.bind(this), editable: this.EnableChangePrice() },
      {headerName: 'UM', field: 'SalUnitMsr', maxWidth: '50', minWidth: '70', cellStyle: {textAlign: 'center'}},
      {headerName: 'Almacén', field: 'WhsCode', maxWidth: '100', minWidth: '70', cellStyle: {textAlign: 'center'}, hide: true},
      {headerName: 'Cod. Impuesto', field: 'TaxCode', maxWidth: '130', minWidth: '100', cellStyle: {textAlign: 'center'}},
      {headerName: 'Descuento', field: 'Discount', maxWidth: '70', minWidth: '110', cellStyle: {textAlign: 'center'}, editable: true, type: 'numericColumn', valueSetter: this.validateDesc.bind(this)},
      {headerName: 'Impuesto', field: 'Importe', maxWidth: '70', minWidth: '120', cellStyle: {textAlign: 'center'}, cellRenderer: this.CurrencyCellRendererUSD, valueGetter: this.importeValueGetter },
      {headerName: 'Total', field: 'Total', maxWidth: '100', minWidth: '150', cellStyle: {textAlign: 'center'}, cellRenderer: this.CurrencyCellRendererUSD, valueGetter: this.totalValueGetter}
  ];

  constructor(
    private sharedService: SharedService,
    private auth: AuthService,
    public toastService: ToastService
  ) {
    const val = this.auth.getDataToken();
    this.descuentoMax = Number(val.PDescuento);
    this.subscription = this.sharedService.sharedMessage.subscribe( response => {
      if (response !== null) {
       if (this.agGridC !== undefined) {
          if (this.ExistItem(response.ItemCode) === false) {
            this.agGridC.api.applyTransaction({add: [ this.buildRows(response) ]});
            this.getAllRows();
          } else {
            const i = this.rowDataCot.findIndex(n => n.ItemCode === response.ItemCode);
            this.rowDataCot[i].Quantity = this.rowDataCot[i].Quantity;
            this.rowDataCot[i].Importe = this.importeFromOrder(this.rowDataCot[i]);
            this.rowDataCot[i].Total = this.totalFromOrder(this.rowDataCot[i], this.rowDataCot[i].Importe);
            this.rowDataCotEmit.emit(this.rowDataCot);
            this.getAllRows();
          }
       }
      }
    });
  }

  ngOnInit() {

  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onGridReady(params) {
    this.agGridC = params.api;
    // this.gridColumnApi = params.columnApi;
  }
  // Existe artículo en tabla
  ExistItem(item: string): boolean {
    let result = false;
    this.agGridC.api.forEachNode(node => {
      if (node.data.ItemCode === item) {
        node.data.Quantity = node.data.Quantity + 1;
        this.agGridC.api.applyTransaction({ update: [node.data]});
        result = true;
        return;
      }
    });
    return result;
  }
  // construcción de registros
  private buildRows(data: Item) {
    const desc = (100 - 0) / 100;
    const PrConDesc = desc * data.Price;
    const ImpoImpus = (data.Rate / 100) * PrConDesc * 1;
    const value = {
          DocEntry: 0,
          ItemCode: data.ItemCode,
          ItemName: data.ItemName,
          Quantity: 1,
          Price: data.Price,
          SalUnitMsr : data.SalUnitMsr,
          Discount: 0, // Number.parseFloat(inf.PDescuento),
          WhsCode: data.WhsCode,
          TaxCode: data.TaxCode,
          Rate: data.Rate,
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
  // Funcion para calcular el importe
  importeValueGetter(params: any) {
    const desc = (100 - Number.parseFloat(params.data.Discount)) / 100;
    const PrConDesc = desc * params.data.Price;
    params.data.Importe = (params.data.Rate / 100) * PrConDesc * params.data.Quantity;
    return params.data.Importe;
  }
  // Funcion para calcular el total de cada registro
  totalValueGetter(params: any) {
    const desc = (100 - Number.parseFloat(params.data.Discount)) / 100;
    const PrConDesc = (desc * params.data.Price) * params.data.Quantity;
    params.data.Total = (PrConDesc + params.data.Importe);
    return params.data.Total;
  }
  // validación de celda cantidad
  cellValidate(params: any) {
    const regexp = /^[1-9]*(?:\.\d{1,2})?$/;
    let test = regexp.test(params.newValue);
    if (test === false) {
      this.showDanger(`Debe ingresar una cantidad mayor a 0`);
      params.data.Quantity = Number(params.oldValue);
      return false;
    } else {
      params.data.Quantity = Number(params.newValue);
      params.data.Importe = this.importeValueGetter(params);
      params.data.Total = this.totalValueGetter(params);
      this.agGridC.api.applyTransaction({ update: [params.data]});
      return true;
    }
  }
  // validacion de celda para descuento
  validateDesc(params: any) {
    const regexp = /^[0-9]*(?:\.\d{1,2})?$/;
    const test = regexp.test(params.newValue);
    if (test === false) { // No es un número
      params.data.Discount = Number (params.oldValue);
      this.showDanger(`Solo se permiten números mayores a 0`);
      return true;
    } else { // es un número
      const esMaximo = Number(params.newValue) > this.descuentoMax;
      if (esMaximo === true) { // supero el limite de descuento
        params.data.Discount = Number(params.oldValue);
        this.showDanger(`El descuento máximo permitido es de: ${this.descuentoMax} %`);
        return true;
      } else { // No supero el limite de descuento
        params.data.Discount = Number(params.newValue);
        params.data.Importe = this.importeValueGetter(params);
        params.data.Total = this.totalValueGetter(params);
        this.agGridC.api.applyTransaction({ update: [params.data]});
        return true;
      }
    }
  }
  // Cambio de precio
  ValidPriceChange(params: any) {
    const regexp = /^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/;
    const ChangePrice = this.auth.getDataToken();
    let test = regexp.test(params.newValue);
    if (test === true) {
      params.data.Price = Number(params.newValue);
      params.data.Importe = this.importeValueGetter(params);
      params.data.Total = this.totalValueGetter(params);
      this.agGridC.api.applyTransaction({ update: [params.data]});
      return true;
    } else {
      this.showDanger(`Debe ingresar una precio mayor a 0`);
      return false;
    }
  }
  // Habilitar cambio de precio
  EnableChangePrice(): boolean {
    const ChangePrice = this.auth.getDataToken();
    if (ChangePrice.CambioPrecio === 'Y') {
      return true;
    }
    return false;
  }
  // Detectamos el cambio en la celda de cantidad
  onCellValueChanged(event) {
    this.getAllRows();
  }
  // Se dispara al eliminar algun registro
  onRemoveSelected() {
    const selectedData = this.agGridC.api.getSelectedRows();

    let temp = this.rowDataCot.filter((el) => {
      return selectedData.indexOf(el) < 0;
    });
    this.rowDataCot = temp;
    this.rowDataCotEmit.emit(this.rowDataCot);
    this.agGridC.api.applyTransaction({ remove: selectedData });
    this.agGridC.api.applyTransaction({ update: this.rowDataCot});

    this.getAllRows();
  }
  // Actualiza el total del documento
  getAllRows() {
    let infor = [];
    this.agGridC.api.forEachNode(node => infor.push(node.data.Total));
    let result = infor.reduce((a, b) => a + b, 0 );
    this.totalDocumento = result;
    this.getSubtotal();
  }

  private getSubtotal() {
    let imp = [];
    let subt = [];
    this.agGridC.api.forEachNode(node => imp.push(node.data.Importe));
    let sumImp = imp.reduce((a, b) => a + b, 0 );
    this.totalImpuesto = sumImp;

    this.agGridC.api.forEachNode(node => subt.push(node.data.Total));
    let sumSub = subt.reduce((a, b) => a + b, 0 );
    this.subTotalDocumento = sumSub - this.totalImpuesto;
  }

  getSumRows(values: any) {
    let newArray = [];
    this.rowDataCot = [];
    // tslint:disable-next-line: forin
    for (let a in values) {
      const importe = this.importeFromOrder(values[a]);
      const total = this.totalFromOrder(values[a], importe);
      let value = {
        LineNum: values[a].LineNum,
        DocEntry: values[a].DocEntry,
        ItemCode: values[a].ItemCode,
        ItemName: values[a].ItemName,
        Quantity: values[a].Quantity,
        Price: values[a].Price,
        SalUnitMsr : '',
        Discount: values[a].Discount,
        WhsCode: values[a].WhsCode,
        TaxCode: values[a].TaxCode,
        Rate: values[a].Rate,
        Currency: values[a].Currency,
        Importe: importe,
        Total: total // (PrConDesc + ImpoImpus)
      };
      newArray.push(value);
    }
    // console.log(newArray);
    this.rowDataCot = newArray;
    this.rowDataCotEmit.emit(newArray); // notificamos al padre que se actualiza el contenido de las lineas, para que tambien contenga la columna total
    this.agGridC.api.applyTransaction({add: newArray });
    this.getAllRows();
  }

  importeFromOrder(params: any) {
    const desc = (100 - Number.parseFloat(params.Discount)) / 100;
    const PrConDesc = desc * params.Price;
    return  (params.Rate / 100) * PrConDesc * params.Quantity;
  }

  totalFromOrder(params: any, importe: number) {
    const desc = (100 - Number.parseFloat(params.Discount)) / 100;
    const PrConDesc = (desc * params.Price) * params.Quantity;
    return (PrConDesc + importe);
  }

  // Toast
  showSuccess(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-success text-light', delay: 5000 });
  }

  showDanger(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-danger text-light', delay: 5000 });
  }
}
