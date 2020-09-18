import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ModalDismissReasons, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalComponent } from '../shared/modal/modal.component';

import { Document, DocSAP } from '../../../models/marketing';
import { MktService } from '../../../services/marketing/mkt.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { TablaArticulosComponent } from '../shared/tabla-articulos/tabla-articulos.component';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit {
  @ViewChild(TablaArticulosComponent, {static: false}) childTable: TablaArticulosComponent;
  currencies = ['MXP', 'USD', '$'];
  currencySel = this.currencies[0];
  proceso: boolean;
  procesoQt: boolean;
  document: Document;
  docSap: DocSAP;
  rowDataOrder = [];
  DateOrder: NgbDateStruct = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  minDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  closeResult: string;
  list: any;


  constructor(
    private mktServices: MktService,
    private auth: AuthService,
    private modalService: NgbModal
    /* private sharedService: SharedService */
  ) {
    this.document = new Document();
    this.docSap = new DocSAP();
    this.proceso = false;
    this.procesoQt = false;
    /* this.sharedService.sharedList.subscribe(message => this.list = message); */
  }

  ngOnInit() {
    const data = this.auth.getDataToken();
    this.document.CardCode = data.CardCode;
    this.document.CardName = data.CardName;
  }
  // Se ejecuta modal para cargar lista de cotizaciones
  LoadQuotations(dataQut: any) {
    const modalRef = this.modalService.open(ModalComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        keyboard: false,
        backdrop: 'static'
      });
    modalRef.componentInstance.fromParent = dataQut; // data;
    modalRef.result.then((result) => {
      if (!result) {
      } else {
        this.rowDataOrder = []; // Para actualizar los datos antes de entrar a la modal, así evitamos que mantenga los datos del anterior
        this.getQuotationSAP(result);
      }
    }, (reason) => {
    });
  }
  // Lista de cotizaciones abiertas
  getDataQuotation() {
    this.procesoQt = true;
    this.mktServices.getDocumentSAP(this.auth.getToken(), 0).subscribe(response => {
      this.LoadQuotations(response);
      this.procesoQt = false;
    }, (err) => {
      Swal.fire({
        title: 'Mensaje de sistema',
        icon: 'error',
        text: err.error
      });
      this.proceso = false;
      this.procesoQt = false;
    });
  }
  // Recuperamos contización especifica para cargar en el form
  getQuotationSAP(result: Document) {
    this.mktServices.getDocumentSAP(this.auth.getToken(), result.DocEntry).subscribe(response => {
      this.document = response.Header;
      let newDate = new Date(response.Header.DocDate);
      this.DateOrder = { year: newDate.getFullYear(), month: (newDate.getMonth() + 1), day: newDate.getDate() };
      // tslint:disable-next-line: forin
      for (let j in response.Detail) {
        response.Detail[j].DocEntry = result.DocEntry;
      }
      this.rowDataOrder = response.Detail;
      this.childTable.getSumRows(response.Detail);
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
    this.docSap.Detail = this.rowDataOrder;
    if (form.invalid) {
      return;
    } else {
      this.proceso = true;
      for (let it of this.docSap.Detail) {
        it.Currency = this.currencySel;
      }
      this.mktServices.createDocument(this.docSap, 17, this.auth.getToken(), this.auth.getDataToken().Code).subscribe(response => {
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
    console.log('refresh', this.rowDataOrder);
    this.rowDataOrder = $event;
  }

  private valueDefault() {
    this.docSap.Header.Comments = '';
    this.docSap.Header.Reference = '';
    this.docSap.Header.DocDate = '';
    this.DateOrder = null;
    this.rowDataOrder = [];
  }

}
