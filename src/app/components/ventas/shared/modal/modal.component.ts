import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import * as moment from 'moment';

import { Document } from 'src/app/models/marketing';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @ViewChild('agGridM', {static: true}) agGridM: AgGridAngular;

  @Input() fromParent = [];

  columnDefs = [
    {headerName: '#', valueGetter: 'node.rowIndex + 1', maxWidth: '50'},
    {headerName: 'DocEntry', field: 'DocEntry', maxWidth: '100', minWidth: '80', hide: true},
    {headerName: 'N° Doc', field: 'DocNum', maxWidth: '80', minWidth: '110'},
    {headerName: 'Codigo Cliente', field: 'CardCode', maxWidth: '150', minWidth: '100' },
    {headerName: 'Nombre Cliente', field: 'CardName',  maxWidth: '250', minWidth: '100' },
    {headerName: 'Fecha', field: 'DocDate',  maxWidth: '100', minWidth: '150', valueFormatter: (data) => moment(data.value).format('L')},
    {headerName: 'Referencia', field: 'Reference', maxWidth: '100', minWidth: '200', hide: true},
    {headerName: 'Comentario', field: 'Comments', maxWidth: '300', minWidth: '200', hide: true}
  ];
  pageSize = 5;
  quickSearchValue = '';

  constructor(
    public activeModal: NgbActiveModal
  ) {
    if (this.agGridM !== undefined) {
      this.agGridM.api.applyTransaction({add: [ this.fromParent ]});
    }
   }

  ngOnInit() {
  }

  closeModal(sendData) {
    this.activeModal.close(sendData);
  }

  // Cada que cambien el paginado
  onPageSizeChanged(newPageSize) {
    this.agGridM.api.paginationSetPageSize(newPageSize);
  }
  // cuando realizan una busqueda
  onQuickFilterChanged() {
    this.agGridM.api.setQuickFilter(this.quickSearchValue);
  }

  onCellClicked(event: any) {
    this.activeModal.close(event.data);
  }

}
