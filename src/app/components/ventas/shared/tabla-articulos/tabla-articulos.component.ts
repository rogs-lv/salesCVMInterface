import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import Swal from 'sweetalert2';

import { DocumentLines } from 'src/app/models/marketing';
import { Item } from 'src/app/models/masterData';

@Component({
  selector: 'app-tabla-articulos',
  templateUrl: './tabla-articulos.component.html',
  styleUrls: ['./tabla-articulos.component.css']
})
export class TablaArticulosComponent implements OnInit {
  @ViewChild('agGrid', {static: true}) agGrid: AgGridAngular;

  columnDefs = [{headerName: '#', valueGetter: 'node.rowIndex + 1' , maxWidth: '60'}, {headerName: 'Codigo', field: 'ItemCode', maxWidth: '150', minWidth: '50' }, {headerName: 'Nombre', field: 'ItemName', maxWidth: '250', minWidth: '100' }, {headerName: 'Cantidad', field: 'Quantity', maxWidth: '100', minWidth: '70'},{headerName: 'Precio', field: 'Price' }, {headerName: 'UM', field: 'SalUnitMsr', maxWidth: '50', minWidth: '70' }, {headerName: 'Importe', field: 'Importe', maxWidth: '50', minWidth: '70' }, {headerName: 'Total', field: 'Total', maxWidth: '50', minWidth: '70'}];
  pageSize = 10;
  quickSearchValue = '';

  constructor(
  ) {
  }

  ngOnInit() {
    /* this.agGrid.api.setRowData();
    this.agGrid.api.onFilterChanged(); */
  }

  private buildRows(data: any): Array<DocumentLines> {
    const rows = [];
    // tslint:disable-next-line: forin
    for (const i in data) {
      rows.push(
        {
          DocEntry: 0,
          ItemCode: data[i].ItemCode,
          ItemName: data[i].ItemName,
          Quantity: data[i].Quantity,
          Price: data[i].Price,
          UnitePrice: data[i].UnitePrice,
          Discount: data[i].Discount,
          Currency: data[i].Currency,
          TaxCode: data[i].TaxCode
        }
      );
    }
    return rows;
  }

  onPageSizeChanged(newPageSize) {
    this.agGrid.api.paginationSetPageSize(newPageSize);
  }

  onQuickFilterChanged() {
    this.agGrid.api.setQuickFilter(this.quickSearchValue);
  }
}
