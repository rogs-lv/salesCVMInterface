import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DocSAP } from 'src/app/models/marketing';

import Swal from 'sweetalert2';

import { MktService } from '../../../services/marketing/mkt.service';
import { AuthService } from '../../../services/authentication/auth.service';
@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css']
})
export class CotizacionComponent implements OnInit {

  document: DocSAP;
  proceso: boolean;

  constructor(
    private mktService: MktService,
    private auth: AuthService
  ) {
    this.document = new DocSAP();
    this.proceso = false;
  }

  ngOnInit() {
  }

  saveDoc(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.proceso = true;
      this.mktService.saveDocument(this.document, 23, this.auth.getToken()).subscribe(response => {
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
    }
  }

  getDocumento(docEntry: number) {
    this.mktService.getDocument(this.auth.getToken(), 23, docEntry).subscribe(response => {
      console.log(response);
    }, (err) => {
      Swal.fire({
        title: 'Mensaje de sistema',
        icon: 'error',
        text: err.error
      });
    });
  }
}
