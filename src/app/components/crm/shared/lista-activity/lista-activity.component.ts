import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Actividad } from 'src/app/models/actividad';
import { AuthService } from 'src/app/services/authentication/auth.service';
import Swal from 'sweetalert2';
import { ActividadService } from '../../../../services/actividades/actividad.service';

@Component({
  selector: 'app-lista-activity',
  templateUrl: './lista-activity.component.html',
  styleUrls: ['./lista-activity.component.css']
})
export class ListaActivityComponent implements OnInit {

  @ViewChild('agGrid', {static: true}) agGrid: AgGridAngular;
  @Output() actSel = new EventEmitter<Actividad>();

  rowData = [];
  pagSize = 10;
  quickSearchValue = '';

  columnDefs = [
    {headerName: '#', field: 'ClgCode', maxWidth: '20', minWidth: '50'},
    {headerName: 'Codigo SN', field: 'CardCode', maxWidth: '100', minWidth: '120'},
    {headerName: 'Nombre SN', field: 'CardName', maxWidth: '160', minWidth: '150'},
    {headerName: 'Tipo', field: 'Action', maxWidth: '200', minWidth: '180'},
  ];

  constructor(
    private auth: AuthService,
    private service: ActividadService
  ) { }

  ngOnInit() {
    this.getListAct();
  }
  // get list of partner
  getListAct() {
    this.service.getActividades(this.auth.getToken()).subscribe(response => {
      this.agGrid.api.setRowData(response);
      this.agGrid.api.onFilterChanged();
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener actividades' : err.error
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
    this.actSel.emit(event.data);
  }

  refreshListActs() {
    this.getListAct();
  }
}
