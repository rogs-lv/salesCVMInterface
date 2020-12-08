import { Component, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import Swal from 'sweetalert2';
import { ToastService } from 'src/app/services/toasts/toast.service';

import { AuthService } from 'src/app/services/authentication/auth.service';
import { PersonaContacto, Vendedor, Territorio, ProyectoSN, Industria, FuenteInformacion, Etapas, Partner, Relacion, Opportunity, Competidores, RowEtapas, OpenDocs, PartnerOpp, TableEtapa, Document as _document  } from '../../../models/oportunidad';
import { OportunidadService } from '../../../services/oportunidades/oportunidad.service';
import { ReturnStatement } from '@angular/compiler';
import { ListaOppComponent } from '../shared/lista-opp/lista-opp.component';
import * as moment from 'moment';

@Component({
  selector: 'app-crm-oportunidades',
  templateUrl: './crm-oportunidades.component.html',
  styleUrls: ['./crm-oportunidades.component.css']
})
export class CrmOportunidadesComponent implements OnInit {
  @ViewChild(ListaOppComponent, {static: true}) childListOpps: ListaOppComponent;
  // Dropdowns
  ListPersCont: Array<PersonaContacto>;
  ListTerriSN: Array<Territorio>;
  ListVendedor: Array<Vendedor>;
  ListProyeSN: Array<ProyectoSN>;
  ListFuentInf: Array<FuenteInformacion>;
  ListIndustri: Array<Industria>;
  ListEtapa: Array<Etapas>;
  ListVendedorEtapa: Array<Vendedor>;
  ListTipoDoc = [ { Code: 23, Name: 'Cotización' }, { Code: 17, Name: 'Pedido' }, { Code: 15, Name: 'Entrega' }, { Code: 13, Name: 'Factura de Venta' }, { Code: 540000006, Name: 'Oferta de Compra' }, { Code: 22, Name: 'Orden de Compra' }, { Code: 20, Name: 'Pedido de entrada de mercancia' }, { Code: 18, Name: 'Factura Proveedores' }];
  ListPartner: Array<Partner>;
  ListRelacion: Array<Relacion>;
  ListCompets: Array<Competidores>;
  ListAmenaz = [ { Code: '1', Name: 'Bajo' }, { Code: '2', Name: 'Medio' }, { Code: '3', Name: 'Alto'} ];
  ListEstatus = [ { Code: 'O', Name: 'Abierto'}, { Code: 'W', Name: 'Ganado'}, { Code: 'L', Name: 'Perdido'} ];
  ListOpenDocs: Array<OpenDocs>;
  // Dates document
  OpenDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  CloseDate = { year: 0, month: 0, day: 0 };
  PredDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  // Dates Stage document
  OpenDateStage = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  CloseDateStage = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };

  // Rows of Tabs Stage, Partner and Competitions
  rowStage: RowEtapas;
  rowPartner: Partner;
  rowCompet: Competidores;

  // Others
  progress: number;
  // duration = 0;
  crtRowSt = true;
  crtRowPt = true;
  crtRowCp = true;
  submited = false;
  edit = false;
  active = 1;
  // montoPt = 0;

  // Document
  document: Opportunity;

  constructor(
    private auth: AuthService,
    private service: OportunidadService,
    public toastService: ToastService
  ) {
    this.ListIndustri = [];
    this.document = new Opportunity();
    this.rowStage = new RowEtapas();
    this.rowPartner = new Partner();
    this.rowCompet = new Competidores();
  }

  ngOnInit() {
    this.progress = 0;
    this.getOpsTabGral(2);
  }

  // fill dropdowns
  getOptions(type: number, cardCode: string, idOpp: number) {
    this.service.getOptionsHdOpp(this.auth.getToken(), type, cardCode, idOpp).subscribe(response => {
      this.ListPersCont = response.ListPrsContacto;
      this.ListTerriSN = response.ListTerritorio;
      this.ListVendedor = response.ListVendedor;
      this.createRow('E');
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener datos para el documento' : err.error
      });
    });
  }
  getOpsTabGral(type: number ) {
    this.service.getOptionsHdOpp(this.auth.getToken(), type, '', 0).subscribe(response => {
      this.ListProyeSN = response.ListProyectoSN;
      this.ListFuentInf = response.ListaInformacion;
      this.ListIndustri = response.ListIndustria;
      this.ListVendedorEtapa = response.ListVendedor;
      this.ListEtapa = response.ListEtapa;
      this.ListRelacion = response.ListRelacion;
      this.ListCompets = response.ListCompetidor;
      this.ListPartner = response.ListPartner;
      // this.ListRazones = response.ListRazones;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener datos para la pestaña de General' : err.error
      });
    });
  }
  getOptionsToOpp(type: number, cardCode: string, idOpp: number) {
    this.service.getOptionsHdOpp(this.auth.getToken(), type, cardCode, idOpp).subscribe(response => {
      this.ListPersCont = response.ListPrsContacto;
      this.ListTerriSN = response.ListTerritorio;
      this.ListVendedor = response.ListVendedor;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener opciones para el documento' : err.error
      });
    });
  }

  // Lisen clic on list partners
  onLisenPartner(value: PartnerOpp) {
    // Si se esta consultado una oportunidad, esta no puede cambiar de cliente
    if (this.document.Header.OpprId > 0 && this.document.Header.OpprId !== null) {
      this.showDanger('El socio de negocios no puede ser modificado');
    } else { // Si estamos creando una oportunidad
      if (this.document.Header.CardCode === '' || value.CardCode !== this.document.Header.CardCode) {
        this.document.Header.CardCode = value.CardCode;
        this.document.Header.CardName = value.CardName;
        this.document.Header.SlpCode = value.SlpCode;
        this.document.Tabs.TableEtapas = [];
        this.onResetStatus();
        this.getOptions(1, value.CardCode, 0);
      }
    }
  }
  onLisenOpp(value: _document) {
    // section header to opportunity
    this.getOptionsToOpp(1, value.CardCode, value.OpprId);
    this.document.Header = value;
    this.progress = value.CloPrcnt;
    this.OpenDate = this.dateStruct(moment(this.document.Header.OpenDate).toDate());
    // seccion detail/tabs to opportunity
    this.getOpsTabGral(2);
    this.getDataTabsOppId(value.OpprId);
  }

  onCreateOpp(frmOpp: NgForm) {
    if (frmOpp.invalid && (this.montoPotencial() === false || !this.document.Header.Name)) {
      Swal.fire({
        title: 'Error en formulario',
        icon: 'error',
        text: 'Los datos del formulario no son validos'
      });
      return;
    } else {
      this.submited = true;
      if (this.document.Tabs.TabResumen.Status === 'O' || !this.document.Tabs.TabResumen.Status) {
        this.document.Header.CloseDate = null;
      }
      // console.log(this.document);
      this.service.createOpp(this.auth.getToken(), this.document, '').subscribe(response => {
        Swal.fire({
          title: 'Oportunidad Creada',
          icon: 'success',
          text: String(response.Code)
        });
        this.submited = false;
        frmOpp.reset();
        this.onReset();
        this.progress = 0;
        this.childListOpps.refreshListOpps();
      }, (err) => {
        this.submited = false;
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: err.status === 0 ? 'Error al crear la oportunidad' : err.error
        });
      });
    }
  }

  onUpdateOpp(frmOpp: NgForm) {
    if (frmOpp.invalid && (this.montoPotencial() === false || !this.document.Header.Name)) {
      Swal.fire({
        title: 'Error en formulario',
        icon: 'error',
        text: 'Los datos del formulario no son validos'
      });
      return;
    } else {
      this.submited = true;
      if (this.document.Tabs.TabResumen.Status === 'O' || !this.document.Tabs.TabResumen.Status) {
        this.document.Header.CloseDate = null;
      }
      if (this.document.Tabs.TabResumen.Status === 'W' || this.document.Tabs.TabResumen.Status === 'L') {
        this.document.Header.CloseDate = moment(`${this.CloseDate.day}/${this.CloseDate.month}/${this.CloseDate.year}`.toString(), 'DD/MM/YYYY').toDate();
      }
      // console.log(this.document);
      this.service.updateOpp(this.auth.getToken(), this.document, '').subscribe(response => {
        Swal.fire({
          title: 'Oportunidad actualizada',
          icon: 'success',
          text: String(response.Code)
        });
        this.submited = false;
        frmOpp.reset();
        this.onReset();
        this.progress = 0;
        this.childListOpps.refreshListOpps();
      }, (err) => {
        this.submited = false;
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: err.status === 0 ? 'Error al actualizar la oportunidad' : err.error
        });
      });
    }
  }

  onCancelOpp(frmOpp: NgForm) {
    // frmOpp.reset();
    frmOpp.controls.Name.reset();
    // frmOpp.controls.WtSumLoc.reset();
    this.onReset();
    this.progress = 0;
    this.OpenDateStage = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.CloseDateStage = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  }

  // function aditionals
  createRow(type: string, newObj: any = null) {
    switch (type) {
      case 'E':
        const dfEta = this.ListEtapa[0];
        const dtVen = this.ListVendedor.find(val => val.SlpCode === this.document.Header.SlpCode);
        const defStage = new TableEtapa({SlpCode: dtVen.SlpCode, SlpName: dtVen.SlpName, OpenDate: moment(this.rowStage.OpenDate).toDate(), CloseDate: moment(this.rowStage.CloseDate).toDate(), Step_Id: dfEta.StepId, Descript: dfEta.Descript , ClosePrcnt: dfEta.CloPrcnt, WtSumLoc: 0, ObjType: 0, DocNumber: 0, LineNum: -1, Status: 'O'});
        this.document.Tabs.TableEtapas.push(defStage);
        this.progressBar();
        break;
      default:
        break;
    }
  }
  getDataTabsOppId(id: number) {
    this.service.getDataTabsOpp(this.auth.getToken(), 97, id).subscribe( response => {
      this.document.Tabs.TabPotencial = response.TabPotencial;
      this.PredDate = this.dateStruct(moment(response.TabPotencial.PredDate).toDate());
      this.document.Tabs.TabGeneral = response.TabGeneral;
      this.document.Tabs.TableEtapas = response.TableEtapas;
      this.document.Tabs.TablePartner = response.TablePartner;
      this.document.Tabs.TableCompet = response.TableCompet;
      this.document.Tabs.TabResumen = response.TabResumen;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener datos para el documento' : err.error
      });
    });
  }
  // progress bar
  private progressBar() {
    if (this.document.Tabs.TableEtapas.length === 1) {
      this.progress = this.document.Tabs.TableEtapas[0].ClosePrcnt;
    } else {
      const i = this.document.Tabs.TableEtapas.length - 1;
      this.progress = this.document.Tabs.TableEtapas[i].ClosePrcnt;
    }
  }
  dateStruct(date: Date) {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  // events change
  // change Type document in tab stage
  onChgTypeDocSt() {
    // fill array ListOpenDocs
    this.rowStage.DocNumber = 0;
    this.service.getListSelects(this.auth.getToken(), '1', this.rowStage.ObjType).subscribe(response => {
        this.ListOpenDocs = response;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener datos para el tipo de documento' : err.error
      });
    });
  }
  // change partner id in tab partner
  onChangePartner(): void {
    const ptn = this.ListPartner.find(vl => vl.ParterId === this.rowPartner.ParterId);
    this.rowPartner.RelatCard = ptn.RelatCard;
  }
  // change competitor in tab competitors
  onChangeCompet(): void {
    const comp = this.ListCompets.find(vl => vl.CompetId === this.rowCompet.CompetId);
    this.rowCompet.ThreatLevi = comp.ThreatLevi;
    this.rowCompet.Memo = comp.Memo;
    this.rowCompet.NameCompet = comp.NameCompet;
    this.rowCompet.Name = comp.Name;
  }
  // change date in tab potential
  onChangeDatePot(): void {
    const fechaInicio = moment(`${this.OpenDate.day}/${this.OpenDate.month}/${this.OpenDate.year}`.toString(), 'DD/MM/YYYY');
    const fechaFin = moment(`${this.PredDate.day}/${this.PredDate.month}/${this.PredDate.year}`.toString(), 'DD/MM/YYYY');
    this.document.Tabs.TabPotencial.ClosePrev = fechaFin.diff(fechaInicio, 'days');
    this.document.Tabs.TabPotencial.PredDate = fechaFin.toDate();
  }
  onChangeStatusDoc(): void {
    if (this.document.Tabs.TabResumen.Status !== 'O') {
      this.CloseDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
      this.document.Header.Status = this.document.Tabs.TabResumen.Status;
    }
  }
  // Operation Update/Create/Cancel in tabs Stage
  onUpdateRowStage(form: NgForm) {
    const i = this.document.Tabs.TableEtapas.findIndex(vl => vl.LineNum === this.rowStage.LineNum && vl.Status === this.rowStage.Status);
    this.processRowStage();
    this.document.Tabs.TableEtapas.splice(i, 1, this.rowStage);
    this.progressBar();
    this.onCancelRowStage(form);
  }
  onCancelRowStage(form: NgForm) {
    this.crtRowSt = true;
    this.rowStage = new RowEtapas();
    form.controls.WtSumLocE.reset();
    form.controls.CloseDateStage.reset();
    form.controls.OpenDateStage.reset();
  }
  onAddRowStage(form: NgForm) {
    this.processRowStage();
    this.rowStage.Status = 'O';
    this.closeStage();
    this.document.Tabs.TableEtapas.push(this.rowStage);
    this.progressBar();
    this.onCancelRowStage(form);
  }
  onClicRowStage(i: number) {
    if ((this.document.Tabs.TableEtapas.length === 1) || (this.document.Tabs.TableEtapas.length - 1) === i) {
      // Editar
      this.crtRowSt = false;
      this.rowStage = this.document.Tabs.TableEtapas[i];
      this.OpenDateStage = this.dateStruct(moment(this.document.Tabs.TableEtapas[i].OpenDate).toDate());
      this.CloseDateStage = this.dateStruct(moment(this.document.Tabs.TableEtapas[i].CloseDate).toDate());
    } else {
      // No Editar
      return;
    }
  }
  processRowStage(): void {
    const etp = this.ListEtapa.find(e => e.StepId === this.rowStage.Step_Id);
    const vdr = this.ListVendedorEtapa.find(v => v.SlpCode === this.rowStage.SlpCode);
    this.rowStage.SlpName = vdr.SlpName;
    this.rowStage.OpenDate = moment(`${this.OpenDateStage.year}/${this.OpenDateStage.month}/${this.OpenDateStage.day}`.toString()).toDate();
    this.rowStage.CloseDate =  moment(`${this.CloseDateStage.year}/${this.CloseDateStage.month}/${this.CloseDateStage.day}`.toString()).toDate();
    this.rowStage.Descript = etp.Descript;
    this.rowStage.ClosePrcnt = etp.CloPrcnt;
  }
  minDateStage(): any {
    const lght = this.document.Tabs.TableEtapas.length;
    if (lght === 1 && !this.crtRowSt) {
      return null; // this.dateStruct(this.document.Tabs.TableEtapas[0].CloseDate);
    }
    if (lght === 1 && this.crtRowSt) {
      return this.dateStruct(moment(this.document.Tabs.TableEtapas[0].CloseDate).toDate());
    }
    if (lght > 1 && !this.crtRowSt) { // Editando row
      return this.dateStruct(moment(this.document.Tabs.TableEtapas[(lght - 1)].OpenDate).toDate());
    }
    if (lght > 1 && this.crtRowSt) { // creando row
      return this.dateStruct(moment(this.document.Tabs.TableEtapas[(lght - 1)].CloseDate).toDate());
    }
  }
  maxDateStage(): any {
    const lght = this.document.Tabs.TableEtapas.length;
    if (lght > 1 && this.crtRowSt) {
      return this.dateStruct(moment(this.document.Tabs.TableEtapas[(lght - 1)].CloseDate).add(30, 'days').toDate());
    }
  }
  closeStage() {
    const len = this.document.Tabs.TableEtapas.length;
    if (len === 1) {
      this.document.Tabs.TableEtapas[0].Status = 'C';
    } else {
      this.document.Tabs.TableEtapas[(len - 1)].Status = 'C';
    }
  }
  montoPotencial(): boolean {
    const len = this.document.Tabs.TableEtapas.length;
    if (len === 0) {
      return false;
    }
    if (len === 1) {
      return this.document.Tabs.TableEtapas[0].WtSumLoc > 0 ? true : false;
    }
    if (len > 1) {
      return this.document.Tabs.TableEtapas[(len - 1)].WtSumLoc > 0 ? true : false;
    }
  }
  // Operation Update/Create/Cancel in tabs Partner
  onUpdateRowPartner(form: NgForm) {
    if (this.rowPartner.Line >= 0) { // es una linea de SAP
      const j = this.document.Tabs.TablePartner.findIndex(k => k.Line === this.rowPartner.Line);
      this.rowPartner.Name = this.ListPartner.find(vl => vl.ParterId === this.rowPartner.ParterId).Name;
      this.rowPartner.OrlDesc = this.rowPartner.OrlCode <= 0 ? '' : this.ListRelacion.find(od => od.OrlCode === this.rowPartner.OrlCode).OrlDesc;
      this.document.Tabs.TablePartner.splice(j, 1, this.rowPartner);
      this.onCancelRowPartner(form);
    }
    if (this.rowPartner.iPortal >= 0) { // es una linea del portal
      const i = this.document.Tabs.TablePartner.findIndex(j => j.iPortal === this.rowPartner.iPortal);
      this.rowPartner.Name = this.ListPartner.find(vl => vl.ParterId === this.rowPartner.ParterId).Name;
      this.rowPartner.OrlDesc = this.rowPartner.OrlCode <= 0 ? '' : this.ListRelacion.find(od => od.OrlCode === this.rowPartner.OrlCode).OrlDesc;
      this.document.Tabs.TablePartner.splice(i, 1, this.rowPartner);
      this.onCancelRowPartner(form);
    }
  }
  onCancelRowPartner(form: NgForm) {
    this.rowPartner = new Partner();
    form.controls.ParterId.reset();
    form.controls.RelatCard.reset();
    form.controls.OrlCode.reset();
    form.controls.MemoP.reset();
    this.crtRowPt = true;
  }
  onAddRowPartner(form: NgForm) {
    const i = this.document.Tabs.TablePartner.length;
    this.rowPartner.Name = this.ListPartner.find(vl => vl.ParterId === this.rowPartner.ParterId).Name;
    this.rowPartner.OrlDesc = this.rowPartner.OrlCode <= 0 ? '' : this.ListRelacion.find(od => od.OrlCode === this.rowPartner.OrlCode).OrlDesc;
    if (i === 0) {
      this.rowPartner.iPortal = 0;
      this.document.Tabs.TablePartner.push(this.rowPartner);
    } else {
      this.rowPartner.iPortal =  i;
      this.document.Tabs.TablePartner.push(this.rowPartner);
    }
    this.onCancelRowPartner(form);
  }
  onClicRowPartner(i: number) {
    this.crtRowPt = false;
    this.rowPartner = this.document.Tabs.TablePartner[i];
  }
  // Operation Update/Create/Cancel in tabs Competitor
  onUpdateRowCompetitor(form: NgForm) {
    if (this.rowCompet.Line >= 0) { // es una linea de SAP
      const j = this.document.Tabs.TableCompet.findIndex(k => k.Line === this.rowCompet.Line);
      this.rowCompet.NameCompet = this.ListCompets.find(vl => vl.CompetId === this.rowCompet.CompetId).NameCompet;
      this.document.Tabs.TableCompet.splice(j, 1, this.rowCompet);
      this.onCancelRowCompetitor(form);
    }
    if (this.rowCompet.iPortal >= 0) { // es una linea del portal
      const i = this.document.Tabs.TableCompet.findIndex(j => j.iPortal === this.rowCompet.iPortal);
      this.rowCompet.NameCompet = this.ListCompets.find(vl => vl.CompetId === this.rowCompet.CompetId).NameCompet;
      this.document.Tabs.TableCompet.splice(i, 1, this.rowCompet);
      this.onCancelRowCompetitor(form);
    }
  }
  onCancelRowCompetitor(form: NgForm) {
    this.rowCompet = new Competidores();
    form.controls.CompetId.reset();
    form.controls.ThreatLevi.reset();
    this.crtRowCp = true;
  }
  onAddRowCompetitor(form: NgForm) {
    const i = this.document.Tabs.TableCompet.length;
    this.rowCompet.NameCompet = this.ListCompets.find(vl => vl.CompetId === this.rowCompet.CompetId).NameCompet;
    // this.rowCompet.ThreatLevi = this.ListRelacion.find(od => od.OrlCode === this.rowCompet.OrlCode).OrlDesc;
    if (i === 0) {
      this.rowCompet.iPortal = 0;
      this.document.Tabs.TableCompet.push(this.rowCompet);
    } else {
      this.rowCompet.iPortal =  i;
      this.document.Tabs.TableCompet.push(this.rowCompet);
    }
    this.onCancelRowCompetitor(form);
  }
  onClicRowCompetitor(i: number) {
    this.crtRowCp = false;
    this.rowCompet = this.document.Tabs.TableCompet[i];
  }
  // Events reset
  onResetStatus(): void {
    this.document.Tabs.TableEtapas = [];
    this.rowStage = new RowEtapas();
    this.crtRowSt = true;
  }
  onReset() {
    this.document = new Opportunity();
    this.OpenDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.CloseDate = { year: 0, month: 0, day: 0 };
    this.PredDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.rowStage = new RowEtapas();
    this.rowPartner = new Partner();
    this.rowCompet = new Competidores();
  }
  // Toast
  showSuccess(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-success text-light', delay: 5000 });
  }

  showDanger(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-danger text-light', delay: 5000 });
  }
}
