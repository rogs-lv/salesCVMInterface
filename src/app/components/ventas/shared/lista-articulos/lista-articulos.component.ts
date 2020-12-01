import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Grid, GridOptions } from 'ag-grid-community';
import { FormBuilder } from '@angular/forms';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/authentication/auth.service';
import { MtrDataService } from 'src/app/services/masterData/mtr-data.service';
import { Item } from 'src/app/models/masterData';
import { SharedService } from 'src/app/services/shared/shared.service';
import { ImpSN, Document as bpDoc } from 'src/app/models/marketing';

@Component({
  selector: 'app-lista-articulos',
  templateUrl: './lista-articulos.component.html',
  styleUrls: ['./lista-articulos.component.css']
})
export class ListaArticulosComponent implements OnInit {
  @ViewChild('agGrid', {static: true}) agGrid: AgGridAngular;
  @Input() impChildSN: ImpSN;
  @Input() bpChild: bpDoc;
  columnDefs = [
    {headerName: '#', valueGetter: 'node.rowIndex + 1', maxWidth: '60'},
    {headerName: 'Codigo', field: 'ItemCode', maxWidth: '150', minWidth: '50' },
    {headerName: 'Nombre', field: 'ItemName',  maxWidth: '250', minWidth: '100' },
    {headerName: 'Precio', field: 'Price',  maxWidth: '200', minWidth: '100', cellRenderer: this.CurrencyCellRendererUSD},
    {headerName: 'AplicaImpuesto', field: 'VATLiable', maxWidth: '', minWidth: '', hide: true},
    {headerName: 'ImpuestoIndirecto', field: 'IndirctTax', maxWidth: '', minWidth: '', hide: true},
    {headerName: 'UM', field: 'SalUnitMsr', maxWidth: '70', minWidth: '80', hide: true},
    {headerName: 'Cantidad', field: 'Quantity', maxWidth: '100', minWidth: '150', hide: true},
    {headerName: 'Almacén', field: 'WhsCode', maxWidth: '100', minWidth: '180', hide: true},
    {headerName: 'Tipo Impuesto', field: 'TaxCode', maxWidth: '130', minWidth: '180', hide: true}
  ];
  pageSize = 10;
  quickSearchValue = '';

  item: Item;
  listDeft: boolean;

  constructor(
    private mdService: MtrDataService,
    private auth: AuthService,
    private sharedService: SharedService
  ) {
    this.sharedService.sharedMessage.subscribe(message => this.item = message);
  }

  ngOnInit() {
    const valLP = this.auth.getConfListArt();
    if (valLP === null) {
      this.auth.setConfLisArt('0');
      this.getListItemPartner();
      this.listDeft = false;
    } else {
      const LP = this.auth.getConfListArt();
      if (LP === '1') { // true - Default;
        this.listDeft = true;
        this.auth.setConfLisArt('1');
        this.getListItems();
      } else { // false - Cliente
        this.listDeft = false;
        this.auth.setConfLisArt('0');
        this.getListItemPartner();
      }
    }
  }
  // obtenemos lista de artículos usando lista de precios del add-on
  getListItems() {
    const inf = this.auth.getDataToken();
    this.mdService.getItems(this.auth.getToken(), 4, inf.WhsCode , inf.ListNum).subscribe(response => {
      this.agGrid.api.setRowData(this.buildRows(response, inf.WhsCode, inf.TaxCode));
      this.agGrid.api.onFilterChanged();
      /* this.agGrid.api.paginationGoToPage(10); */
    }, (err) => {
      Swal.fire({
        title: 'Mensaje de sistema',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener artículos' : err.error
      });
    });
  }
  // Obtenemos lista de artículos usando lista de precios del Socio
  getListItemPartner() {
    const inf = this.auth.getDataToken();
    this.mdService.getItems(this.auth.getToken(), 4, inf.WhsCode , '', this.bpChild.CardCode).subscribe(response => {
      this.agGrid.api.setRowData(this.buildRows(response, inf.WhsCode, inf.TaxCode));
      this.agGrid.api.onFilterChanged();
    }, (err) => {
      Swal.fire({
        title: 'Mensaje de sistema',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener artículos' : err.error
      });
    });
  }
  // event change input radio
  onChangeRadio(event) {
    if (event) { // true - Default;
      this.listDeft = true;
      this.auth.setConfLisArt('1');
      this.getListItems();
    }
    if (!event) { // false - Cliente
      this.listDeft = false;
      this.auth.setConfLisArt('0');
      this.getListItemPartner();
    }
  }

  onCancelOrder(event: boolean, cardc: string) {
    if (event) { // true - Default;
      this.listDeft = true;
      this.auth.setConfLisArt('1');
      this.getListItems();
    }
    if (!event) { // false - Cliente
      this.listDeft = false;
      this.auth.setConfLisArt('0');
      this.getListItemToOrder(cardc);
    }
  }

  getListItemToOrder(cardCode: string) {
    const inf = this.auth.getDataToken();
    this.mdService.getItems(this.auth.getToken(), 4, inf.WhsCode , '', cardCode).subscribe(response => {
      this.agGrid.api.setRowData(this.buildRows(response, inf.WhsCode, inf.TaxCode));
      this.agGrid.api.onFilterChanged();
    }, (err) => {
      Swal.fire({
        title: 'Mensaje de sistema',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener artículos' : err.error
      });
    });
  }
  // Paginacion
  onPageSizeChanged(newPageSize) {
    this.agGrid.api.paginationSetPageSize(newPageSize);
  }
  // Se detecta la busqueda de los caracteres ingresados
  onQuickFilterChanged() {
    this.agGrid.api.setQuickFilter(this.quickSearchValue);
  }
  // Se limpia campo de busqueda
  onCleanFilter() {
    this.quickSearchValue = '';
    this.agGrid.api.setQuickFilter(this.quickSearchValue);
  }
  // Se envia información cuando se hace clic sobre un registro de la lista de articulos
  /* onRowClicked(event: any) { console.log('row', event); } */
  onCellClicked(event: any) {
    // console.log('Impuesto SN', this.impChildSN, 'Articulo', event.data);
    if (event.data.VATLiable === 'Y' && event.data.IndirctTax === 'N') { // sujeto a impuesto (Impuesto del SN)
      event.data.TaxCode = this.impChildSN.TaxCodeAR;
      event.data.Rate = this.impChildSN.Rate;
      this.sharedService.nextMessage(event.data);
      return;
    } else if (event.data.IndirctTax === 'Y' && event.data.VATLiable === 'Y') { // Impuesto IEPS (Impuesto del artículo)
      this.sharedService.nextMessage(event.data);
      return;
    } else { // Impuesto B00 - 0
      event.data.TaxCode = 'B00';
      event.data.Rate = 0;
      this.sharedService.nextMessage(event.data);
      return;
    }
    // console.log('cell', event.data);
  }

  private buildRows(data: any, whsCode: string, taxCode: string): Array<Item> {
    const rows = [];
    // tslint:disable-next-line: forin
    for (const i in data) {
      rows.push(
        {
          ItemCode: data[i].ItemCode,
          ItemName: data[i].ItemName,
          Price: data[i].Price,
          VATLiable: data[i].VATLiable,
          IndirctTax: data[i].IndirctTax,
          SalUnitMsr: data[i].SalUnitMsr,
          Quantity: 1,
          WhsCode: whsCode,
          Currency: '',
          TaxCode: data[i].TaxCodeAR,
          Rate: data[i].Rate
        }
      );
    }
    return rows;
  }

  CurrencyCellRendererUSD(params: any) {
    const inrFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    });
    return inrFormat.format(params.value);
  }
}
