import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-modal-lista-sn',
  templateUrl: './modal-lista-sn.component.html',
  styleUrls: ['./modal-lista-sn.component.css']
})
export class ModalListaSNComponent implements OnInit {
  @ViewChild('agGridM', {static: true}) agGridM: AgGridAngular;
  @Input() fromParent = [];

  columnDefs = [
    {headerName: '#', valueGetter: 'node.rowIndex + 1', maxWidth: '50'},
    {headerName: 'Codigo', field: 'CardCode', maxWidth: '120', minWidth: '110'},
    {headerName: 'Nombre', field: 'CardName', maxWidth: '210', minWidth: '200'},
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
