import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalListaSNComponent } from '../shared/modal-lista-sn/modal-lista-sn.component';

import { DocSAP, Document, ImpSN } from 'src/app/models/marketing';
import { MktService } from '../../../services/marketing/mkt.service';
import { MtrDataService } from '../../../services/masterData/mtr-data.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { ContactPerson, DireccionEntrega, Vendedor } from 'src/app/models/masterData';

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
  TaxDate: NgbDateStruct = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  currencies = ['MXP', 'USD', '$'];
  currencySel = this.currencies[0];
  slpCodeSel: number;
  SalesEmp: Array<Vendedor>;
  maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  cambiarSN: boolean;
  cargarSN: boolean;
  prsContacto: Array<ContactPerson>;
  dirsEntrega: Array<DireccionEntrega>;
  ImpSN: ImpSN;
  constructor(
    private mktService: MktService,
    private auth: AuthService,
    private mtrService: MtrDataService,
    private modalService: NgbModal
  ) {
    this.document = new Document();
    this.doc = new DocSAP();
    this.SalesEmp = new Array<Vendedor>();
    this.proceso = false;
    this.procesoSave = false;
    this.cargarSN = false;
    this.prsContacto = new Array<ContactPerson>();
    this.dirsEntrega = new Array<DireccionEntrega>();
    this.ImpSN = new ImpSN();
  }

  ngOnInit() {
    const data = this.auth.getDataToken();
    this.getVendedores(data);
    this.getPersonasDirs(data.CardCode);
    this.document.CardCode = data.CardCode;
    this.document.CardName = data.CardName;
    this.cambiarSN = data.CambioSN === 'Y' ? true : false;
    this.ImpSN.TaxCodeAR = data.TaxCode;
    this.ImpSN.Rate = data.Rate;
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
          title: 'Cotización guardada',
          icon: 'success',
          text: String(response)
        });
        this.procesoSave = false;
      }, (err) => {
        Swal.fire({
          title: 'Error al guardar cotización',
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
    this.doc.Header.TaxDate = `${this.TaxDate.year}-${this.TaxDate.month}-${this.TaxDate.day}`;
    this.doc.Header.SlpCode = this.slpCodeSel;
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
          title: 'Cotización creada',
          icon: 'success',
          text: String(response.DocNum)
        });
        this.proceso = false;
        this.valueDefault();
      }, (err) => {
        Swal.fire({
          title: 'Error al crear cotización',
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
        title: 'Error al cargar documentos',
        icon: 'error',
        text: err.error
      });
    });
  }
  getSocios() {
    this.cargarSN = true;
    this.mtrService.getListBP(this.auth.getToken(), 4).subscribe(response => {
      this.LoadBPs(response);
      this.cargarSN = false;
    }, (err) => {
      Swal.fire({
        title: 'Error al cargar Socios de Negocios',
        icon: 'error',
        text: err.error
      });
      this.cargarSN = false;
    });
  }
  // Abrimnos modal
  LoadBPs(dataBP: any) {
    const modalRef = this.modalService.open(ModalListaSNComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
        keyboard: false,
        backdrop: 'static'
      });
    modalRef.componentInstance.fromParent = dataBP; // data;
    modalRef.result.then((result) => {
      if (!result) {
      } else {
        this.document.CardCode = result.CardCode;
        this.document.CardName = result.CardName;
        this.ImpSN.TaxCodeAR = result.TaxCode;
        this.ImpSN.Rate = result.Rate;
        this.getPersonasDirs(result.CardCode);
      }
    }, (reason) => {
    });
  }

  getVendedores(data: any) {
    this.mtrService.getSalesEmployee(this.auth.getToken()).subscribe(response => {
      this.SalesEmp = response;
      this.slpCodeSel = Number(data.SlpCode);
    }, (err) => {
      Swal.fire({
        title: 'Error al cargar vendedores',
        icon: 'error',
        text: err.error
      });
    });
  }

  getPersonasDirs(cardCode: string) {
    this.mtrService.getPersonasDir(this.auth.getToken(), cardCode).subscribe(response => {
      this.prsContacto = response.contactos;
      this.dirsEntrega = response.direcciones;
    }, (err) => {
      Swal.fire({
        title: 'Error al cargar personas de contacto o vendedores',
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
    this.slpCodeSel = Number(this.auth.getDataToken().SlpCode);
    this.document.CardCode = this.auth.getDataToken().CardCode;
    this.document.CardName = this.auth.getDataToken().CardName;
    this.model = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.TaxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.rowDataCot = [];
    this.document.CntctCode = 0;
    this.ImpSN.TaxCodeAR = this.auth.getDataToken().TaxCode;
    this.ImpSN.Rate = this.auth.getDataToken().Rate;
    // this.getPersonasDirs(this.auth.getDataToken().CardCode);
  }
}
