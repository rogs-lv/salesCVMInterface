import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { PartnerOpp } from 'src/app/models/oportunidad';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { OportunidadService } from 'src/app/services/oportunidades/oportunidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-crm-socios',
  templateUrl: './lista-crm-socios.component.html',
  styleUrls: ['./lista-crm-socios.component.css']
})
export class ListaCRMSociosComponent implements OnInit {
  @ViewChild('agGrid', {static: true}) agGrid: AgGridAngular;
  @Output() socioSel = new EventEmitter<PartnerOpp>();

  rowData = [];
  pagSize = 10;
  quickSearchValue = '';

  columnDefs = [
    {headerName: '#', valueGetter: 'node.rowIndex + 1', maxWidth: '50'},
    {headerName: 'Codigo', field: 'CardCode'},
    {headerName: 'Nombre', field: 'CardName'},
    {headerName: 'Tipo', field: 'CardType', hide: true},
    {headerName: 'RFC', field: 'LicTradNum', hide: true},
    {headerName: 'Moneda', field: 'Currency', hide: true},
    {headerName: 'Email', field: 'E_Mail', hide: true}
  ];

  constructor(
    private auth: AuthService,
    private service: OportunidadService
  ) { }

  ngOnInit() {
    this.getListPartner();
  }
  // get list of partner
  getListPartner() {
    this.service.getListSocios(this.auth.getToken()).subscribe(response => {
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
    this.socioSel.emit(event.data);
  }

  refreshListBP() {
    // this.getListPartner();
  }
}
