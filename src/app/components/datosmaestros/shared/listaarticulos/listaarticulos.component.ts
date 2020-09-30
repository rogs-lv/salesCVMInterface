import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';

import Swal from 'sweetalert2';

import { Articulo, DocArticulo, Propiedad } from '../../../../models/articulo';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MtrDataService } from 'src/app/services/masterData/mtr-data.service';

@Component({
  selector: 'app-listaarticulos',
  templateUrl: './listaarticulos.component.html',
  styleUrls: ['./listaarticulos.component.css']
})
export class ListaarticulosComponent implements OnInit {
  @ViewChild('agGrid', {static: true}) agGrid: AgGridAngular;
  @Output() artSel = new EventEmitter<Articulo>();

  rowData = [];
  quickSearchValue = '';
  pagSize = 10;

  columnDefs = [
    {headerName: 'Codigo', field: 'ItemCode'},
    {headerName: 'Nombre', field: 'ItemName'},
    {headerName: 'Grupo', field: 'ItmsGrpCod', hide: true},
    {headerName: 'N° Lista', field: 'ListNum', hide: true},
    {headerName: 'Precio', field: 'Price'},
  ];

  constructor(
    private auth: AuthService,
    private mdService: MtrDataService
  ) { }

  ngOnInit() {
    this.getListItems();
  }

  onPageSizeChanged(newPageSize) {
    this.agGrid.api.paginationSetPageSize(newPageSize);
  }

  onQuickFilterChanged() {
    this.agGrid.api.setQuickFilter(this.quickSearchValue);
  }

  onCleanFilter() {
    this.quickSearchValue = '';
    this.agGrid.api.setQuickFilter(this.quickSearchValue);
  }

  onCellClicked(event: any) {
    this.artSel.emit(event.data);
  }

  getListItems() {
    this.mdService.getDTItems(this.auth.getToken(), 1, '').subscribe(response => {
      this.agGrid.api.setRowData(response);
      // this.rowData = response;
      this.agGrid.api.onFilterChanged();
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'No se obtuvieron artículos' : err.error
      });
    });
  }

  refreshListItems() {
    this.getListItems();
  }
}
