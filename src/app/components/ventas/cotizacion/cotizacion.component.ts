import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import Swal from 'sweetalert2';

import { MktService } from '../../../services/marketing/mkt.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { DocSAP, Document } from 'src/app/models/marketing';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

  document: Document;
  doc: DocSAP;
  proceso: boolean;
  procesoSave: boolean;
  rowDataCot = [];
  model: NgbDateStruct = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  currencies = ['MXP', 'USD', '$'];
  currencySel = this.currencies[0];
  maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

  constructor(
    private mktService: MktService,
    private auth: AuthService
  ) {
    this.document = new Document();
    this.doc = new DocSAP();
    this.proceso = false;
    this.procesoSave = false;
  }

  ngOnInit() {
    const data = this.auth.getDataToken();
    this.document.CardCode = data.CardCode;
    this.document.CardName = data.CardName;
  }

  refreshData($event) {
    this.rowDataCot = $event;
  }
  SaveQuotation(form: NgForm) {
    this.doc.Header = this.document;
    this.doc.Header.Status = 'B';
    let valF: any;
    valF = this.document.DocDate;
    this.doc.Header.DocDate = `${valF.year}-${valF.month}-${valF.day}`;
    this.doc.Detail = this.rowDataCot;
    if (form.invalid) {
      return;
    } else {
      this.procesoSave = true;
      this.mktService.saveDocument(this.doc, 23, this.auth.getToken()).subscribe(response => {
        Swal.fire({
          title: 'Mensaje de sistema',
          icon: 'success',
          text: String(response)
        });
        this.procesoSave = false;
      }, (err) => {
        Swal.fire({
          title: 'Mensaje de sistema',
          icon: 'error',
          text: err.error
        });
        this.procesoSave = false;
      });
    }
  }
  CreateQuotation(form: NgForm) {
    this.doc.Header = this.document;
    this.doc.Header.Status = 'I';
    this.doc.Header.DocDate = `${this.model.year}-${this.model.month}-${this.model.day}`;
    this.doc.Detail = this.rowDataCot;
    if (form.invalid) {
      return;
    } else {
      this.proceso = true;
      for (let it of this.doc.Detail) {
        it.Currency = this.currencySel;
      }
      this.mktService.createDocument(this.doc, 23, this.auth.getToken(), this.auth.getDataToken().Code).subscribe(response => {
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
  getDocumento(docEntry: number) {
    this.mktService.getDocument(this.auth.getToken(), 23, docEntry).subscribe(response => {
      console.log(response);
    }, (err) => {
      console.log(err);
      Swal.fire({
        title: 'Mensaje de sistema',
        icon: 'error',
        text: err.error
      });
    });
  }
  private valueDefault() {
    this.doc.Header.Comments = '';
    this.doc.Header.Reference = '';
    this.doc.Header.DocDate = '';
    this.model = null;
    this.rowDataCot = [];
  }
}
