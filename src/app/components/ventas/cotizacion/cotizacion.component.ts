import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import Swal from 'sweetalert2';

import { MktService } from '../../../services/marketing/mkt.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { DocSAP, Document, DocumentLines } from 'src/app/models/marketing';


@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

  document: Document;
  documentLine: DocumentLines;
  proceso: boolean;
  procesoSave: boolean;
  rowDataCot = [];

  constructor(
    private mktService: MktService,
    private auth: AuthService
  ) {
    this.document = new Document();
    this.documentLine = new DocumentLines();
    this.proceso = false;
    this.proceso = false;
  }

  ngOnInit() {
    const data = this.auth.getDataToken();
    this.document.CardCode = data.CardCode;
    this.document.CardName = data.CardName;
  }

  SaveQuotation(form: NgForm) {
    console.log(form, this.rowDataCot);
    //console.log(this.document);
    /* if (form.invalid) {
      return;
    } else {
      this.proceso = true;
      this.mktService.saveDocument(null, 23, this.auth.getToken()).subscribe(response => {
        console.log(response);
        this.proceso = false;
      }, (err) => {
        Swal.fire({
          title: 'Mensaje de sistema',
          icon: 'error',
          text: err.error
        });
        this.proceso = false;
      });
    } */
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
}
