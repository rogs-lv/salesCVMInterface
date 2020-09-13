import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { Document, DocSAP } from '../../../models/marketing';
import { MktService } from '../../../services/marketing/mkt.service';
import { AuthService } from '../../../services/authentication/auth.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  currencies = ['$', 'MXP', 'USD'];
  currencySel = '';
  proceso: boolean;
  document: Document;
  docSap: DocSAP;
  rowDataCot = [];
  DateOrder: NgbDateStruct;
  minDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

  constructor(
    private mktServices: MktService,
    private auth: AuthService
  ) {
    this.document = new Document();
    this.docSap = new DocSAP();
    this.proceso = false;
  }

  ngOnInit() {
    const data = this.auth.getDataToken();
    this.document.CardCode = data.CardCode;
    this.document.CardName = data.CardName;
  }

  LoadQuotations() {
    this.mktServices.getDocumentSAP(this.auth.getToken(), 0).subscribe(response => {
      // cargamos modal/ventana lateral con lista de datos
      console.log('Documents SAP', response);
    }, (err) => {
      Swal.fire({
        title: 'Mensaje de sistema',
        icon: 'error',
        text: err.error
      });
      this.proceso = false;
    });
  }

  getQuotationSAP(docEntry: number) {
    this.mktServices.getDocumentSAP(this.auth.getToken(), docEntry).subscribe(response => {
      // llenamos modelo para ser presentado en la plantilla
    }, (err) => {
      Swal.fire({
        title: 'Mensaje de sistema',
        icon: 'error',
        text: err.error
      });
      this.proceso = false;
    });
  }

  CreateOrder(form: NgForm) {
    this.docSap.Header = this.document;
    this.docSap.Header.Status = 'I';
    this.docSap.Header.DocDate = `${this.DateOrder.year}-${this.DateOrder.month}-${this.DateOrder.day}`;
    this.docSap.Detail = this.rowDataCot;
    if (form.invalid) {
      return;
    } else {
      this.proceso = true;
      for (let it of this.docSap.Detail) {
        it.Currency = this.currencySel;
      }
      this.mktServices.createDocument(this.docSap, 17, this.auth.getToken()).subscribe(response => {
        Swal.fire({
          title: 'Mensaje de sistema',
          icon: 'success',
          text: String(response.DocNum)
        });
        this.proceso = false;
        this.valueDefault();
      }, (err) => {
        Swal.fire({
          title: 'Mensaje de sistema',
          icon: 'error',
          text: err.error
        });
        this.proceso = false;
      });
    }
  }

  refreshData($event) {
    this.rowDataCot = $event;
  }

  private valueDefault() {
    this.docSap.Header.Comments = '';
    this.docSap.Header.Reference = '';
    this.docSap.Header.DocDate = '';
    this.DateOrder = null;
    this.rowDataCot = [];
  }
}
