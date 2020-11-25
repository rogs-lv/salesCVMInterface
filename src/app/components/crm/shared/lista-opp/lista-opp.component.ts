import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { OportunidadService } from 'src/app/services/oportunidades/oportunidad.service';
import { Opportunity } from 'src/app/models/oportunidad';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-lista-opp',
  templateUrl: './lista-opp.component.html',
  styleUrls: ['./lista-opp.component.css']
})
export class ListaOppComponent implements OnInit {
  @ViewChild('agGrid', {static: true}) agGrid: AgGridAngular;
  @Output() oppSel = new EventEmitter<Opportunity>();

  rowData = [];
  pagSize = 10;
  quickSearchValue = '';

  columnDefs = [
    {headerName: 'Id Op.', field: 'OpprId', maxWidth: '50', minWidth: '10'},
    {headerName: 'Nombre de Op', field: 'Name', maxWidth: '160', minWidth: '120'},
    {headerName: 'Codigo socio', field: 'CardCode', maxWidth: '130', minWidth: '110'},
    {headerName: 'Nombre Socio', field: 'CardName', maxWidth: '160', minWidth: '120'},
    {headerName: '%', field: 'CloPrcnt', hide: true, maxWidth: '15', minWidth: '10'},
    {headerName: 'Cod Vendedor', field: 'SlpCode', maxWidth: '80', minWidth: '50'},
    {headerName: 'Fecha', field: 'OpenDate', maxWidth: '150', minWidth: '50', valueFormatter: (data) => moment(data.value).format('L')}
  ];

  constructor(
    private auth: AuthService,
    private service: OportunidadService
  ) { }

  ngOnInit() {
    this.getListOpps();
  }
  // get list of partner
  getListOpps() {
    this.service.getListOpps(this.auth.getToken()).subscribe(response => {
      this.agGrid.api.setRowData(response);
      this.agGrid.api.onFilterChanged();
    }, (err) => {
      Swal.fire({
        title: 'Mensaje de sistema',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener socios de negocio' : err.error
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

  onCleanFilter() {
    this.quickSearchValue = '';
    this.agGrid.api.setQuickFilter(this.quickSearchValue);
  }
  onGrdiReady(event) {

  }
  onCellClicked(event: any) {
    this.oppSel.emit(event.data);
  }

  refreshListOpps() {
    this.getListOpps();
  }
}
