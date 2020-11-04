import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ModalDismissReasons, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ModalComponent } from '../shared/modal/modal.component';

import { Document, DocSAP } from '../../../models/marketing';
import { MktService } from '../../../services/marketing/mkt.service';
import { AuthService } from '../../../services/authentication/auth.service';
import { TablaArticulosComponent } from '../shared/tabla-articulos/tabla-articulos.component';
import { MtrDataService } from 'src/app/services/masterData/mtr-data.service';
import { ModalListaSNComponent } from '../shared/modal-lista-sn/modal-lista-sn.component';
import { ContactPerson, DireccionEntrega, Vendedor } from 'src/app/models/masterData';

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
  TaxDate: NgbDateStruct = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  minDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  closeResult: string;
  list: any;
  cambiarSN: boolean;
  cargarSN: boolean;
  slpCodeSel: number;
  SalesEmp: Array<Vendedor>;
  prsContacto: Array<ContactPerson>;
  dirsEntrega: Array<DireccionEntrega>;
  dirComplet = '';

  constructor(
    private mktServices: MktService,
    private auth: AuthService,
    private modalService: NgbModal,
    private mtrService: MtrDataService,
  ) {
    this.document = new Document();
    this.docSap = new DocSAP();
    this.proceso = false;
    this.procesoQt = false;
    this.cargarSN = false;
    this.SalesEmp = new Array<Vendedor>();
    this.prsContacto = new Array<ContactPerson>();
    this.dirsEntrega = new Array<DireccionEntrega>();
  }

  ngOnInit() {
    const data = this.auth.getDataToken();
    this.getVendedores(data);
    this.document.CardCode = data.CardCode;
    this.document.CardName = data.CardName;
    this.cambiarSN = data.CambioSN === 'Y' ? true : false;
    this.getPersonasDirs(data.CardCode);
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
        title: 'Error al obtener cotizaciones abiertas',
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
      this.dirCompleta(this.document.ShipToCode);
      let newDate = new Date(response.Header.DocDate);
      this.DateOrder = { year: newDate.getFullYear(), month: (newDate.getMonth() + 1), day: newDate.getDate() };
      let newTaxDate = new Date(response.Header.TaxDate);
      this.TaxDate = { year: newTaxDate.getFullYear(), month: (newTaxDate.getMonth() + 1), day: newTaxDate.getDate() };
      this.slpCodeSel = response.Header.SlpCode;
      // tslint:disable-next-line: forin
      for (let j in response.Detail) {
        response.Detail[j].DocEntry = result.DocEntry;
      }
      this.rowDataOrder = response.Detail;
      this.childTable.getSumRows(response.Detail);
    }, (err) => {
      Swal.fire({
        title: 'Error al descargar cotización',
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
    this.docSap.Header.TaxDate = `${this.TaxDate.year}-${this.TaxDate.month}-${this.TaxDate.day}`;
    this.docSap.Header.SlpCode = this.slpCodeSel;
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
          title: 'Orden creada',
          icon: 'success',
          text: String(response.DocNum)
        });
        this.proceso = false;
        this.valueDefault();
      }, (err) => {
        Swal.fire({
          title: 'Error al crear orden',
          icon: 'error',
          text: err.error
        });
        this.proceso = false;
      });
    }
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
  refreshData($event) {
    this.rowDataOrder = $event;
  }

  dirCompleta(value) {
    this.dirComplet = this.dirsEntrega.filter((val) => val.Address === value)[0].Direccion;
  }

  valueDefault() {
    this.docSap.Header.Comments = '';
    this.docSap.Header.Reference = '';
    this.docSap.Header.DocDate = '';
    this.document.DocNum = 0;
    this.document.DocEntry = 0;
    this.document.CardCode = this.auth.getDataToken().CardCode;
    this.document.CardName = this.auth.getDataToken().CardName;
    this.DateOrder = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.TaxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.slpCodeSel = Number(this.auth.getDataToken().SlpCode);
    this.rowDataOrder = [];
    this.document.CntctCode = 0;
    this.document.ShipToCode = '';
    this.dirComplet = '';
    this.getPersonasDirs(this.auth.getDataToken().CardCode);
  }

  cancelQts() {
    this.document = new Document();
    this.document.CardCode = this.auth.getDataToken().CardCode;
    this.document.CardName = this.auth.getDataToken().CardName;
    this.DateOrder = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.slpCodeSel = Number(this.auth.getDataToken().SlpCode);
    this.rowDataOrder = [];
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
        this.dirComplet = '';
        this.document.ShipToCode = '';
        this.document.CardCode = result.CardCode;
        this.document.CardName = result.CardName;
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
}
