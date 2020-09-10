import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Grid, GridOptions } from 'ag-grid-community';
import { FormBuilder } from '@angular/forms';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/authentication/auth.service';
import { MtrDataService } from 'src/app/services/masterData/mtr-data.service';
import { Item } from 'src/app/models/masterData';



@Component({
  selector: 'app-lista-articulos',
  templateUrl: './lista-articulos.component.html',
  styleUrls: ['./lista-articulos.component.css']
})
export class ListaArticulosComponent implements OnInit {
  @ViewChild('agGrid', {static: true}) agGrid: AgGridAngular;

  columnDefs = [
    {headerName: '#', valueGetter: 'node.rowIndex + 1', maxWidth: '60'},
    {headerName: 'Codigo', field: 'ItemCode', maxWidth: '150', minWidth: '50' },
    {headerName: 'Nombre', field: 'ItemName',  maxWidth: '250', minWidth: '100' },
    {headerName: 'Precio', field: 'Price',  maxWidth: '50', minWidth: '100' },
    {headerName: 'AplicaImpuesto', field: 'VATLiable', maxWidth: '', minWidth: '', hiden: true},
    {headerName: 'ImpuestoIndirecto', field: 'IndirctTax', maxWidth: '', minWidth: '', hiden: true},
    {headerName: 'UM', field: 'SalUnitMsr', maxWidth: '70', minWidth: '80', hiden: true},
    {headerName: 'Cantidad', field: 'Quantity', maxWidth: '100', minWidth: '150', hiden: true},
    {headerName: 'Almacén', field: 'WhsCod', maxWidth: '100', minWidth: '180', hiden: true}
  ];
  pageSize = 10;
  quickSearchValue = '';



  constructor(
    private mdService: MtrDataService,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    this.getListItems();
  }

  getListItems() {
    this.mdService.getItems(this.auth.getToken(), 4, '01', '3').subscribe(response => {
      this.agGrid.api.setRowData(this.buildRows(response));
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

  onPageSizeChanged(newPageSize) {
    this.agGrid.api.paginationSetPageSize(newPageSize);
  }

  onQuickFilterChanged() {
    this.agGrid.api.setQuickFilter(this.quickSearchValue);
  }

  /* onRowClicked(event: any) { console.log('row', event); } */
  onCellClicked(event: any) { console.log('cell', event); }
  /* onSelectionChanged(event: any) { console.log('selection', event); } */

  private buildRows(data: any): Array<Item> {
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
          WhsCode: ''
        }
      );
    }
    return rows;
  }
}
