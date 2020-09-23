import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';

import { MtrDataService } from 'src/app/services/masterData/mtr-data.service';
import { AuthService } from '../../../../services/authentication/auth.service';

import Swal from 'sweetalert2';
import { SocioNegocios } from 'src/app/models/socioNegocios';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-listasocios',
  templateUrl: './listasocios.component.html',
  styleUrls: ['./listasocios.component.css']
})
export class ListasociosComponent implements OnInit {
  @ViewChild('agGrid', {static: true}) agGrid: AgGridAngular;
  @Output() socioSel = new EventEmitter<SocioNegocios>();

  rowData = [];
  pagSize = 10;
  quickSearchValue = '';

  columnDefs = [
    {headerName: 'Codigo', field: 'CardCode'},
    {headerName: 'Nombre', field: 'CardName'},
    {headerName: 'Tipo', field: 'CardType', hide: true},
    {headerName: 'RFC', field: 'LicTradNum', hide: true},
    {headerName: 'Moneda', field: 'Currency', hide: true},
    {headerName: 'Email', field: 'E_Mail', hide: true}
  ];

  socioNegocios: SocioNegocios;

  constructor(
    private auth: AuthService,
    private mdService: MtrDataService,
    private sharedService: SharedService
  ) {
    // this.sharedService.sharedSocioBP.subscribe(sn => this.socioNegocios = sn);
  }

  ngOnInit() {
    this.getListPartner();
  }

  getListPartner() {
    this.mdService.getListBP(this.auth.getToken(), 1).subscribe(response => {
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

  onGrdiReady(event) {

  }
  onCellClicked(event: any) {
    this.socioSel.emit(event.data);
    // this.sharedService.nextSocioBP(event.data);
  }
}
