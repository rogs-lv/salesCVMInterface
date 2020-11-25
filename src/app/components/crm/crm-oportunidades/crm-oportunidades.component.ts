import { Component, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ToastService } from 'src/app/services/toasts/toast.service';

import { AuthService } from 'src/app/services/authentication/auth.service';
import { OpportunitySAP, OptionsHeaderOpp, OptionsTabGralOpp, Etapas, OpenDocs } from '../../../models/oportunidad';
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

  docSap: OpportunitySAP;
  optsOpp: OptionsHeaderOpp;
  optsTabGral: OptionsTabGralOpp;
  formOpp: FormGroup;
  submitted = false;
  OpenDate: NgbDateStruct;
  CloseDate: NgbDateStruct;
  PredDate: NgbDateStruct;
  duration: number;
  durationValid: number;
  ListTypeDoc = [{"Code": 23, "Name": "Cotización"}, {"Code": 17, "Name": "Pedido"}, {"Code": 15, "Name": "Entrega"}, {"Code": 13, "Name": "Factura de Venta"}, {"Code": 540000006, "Name": "Oferta de Compra"}, {"Code": 22, "Name": "Orden de Compra"}, {"Code": 20, "Name": "Pedido de entrada de mercancia"}, {"Code": 18, "Name": "Factura Proveedores"}];
  ListAmenazas = [{"Code": '1', "Name": 'Bajo' }, { "Code": '2', "Name": 'Medio' }, { "Code": '3', "Name": 'Alto'} ];
  ListStatusOpp = [{"Code": 'O', "Name": 'Abierto'}, {"Code": 'W', "Name": 'Ganado'}, {"Code": 'L', "Name": 'Perdido'}]
  tEtOpenDate: NgbDateStruct;
  tEtCloseDate: NgbDateStruct;
  duratValidEtp: number;
  progress = 0;
  UpdRowEtapa = false;
  UpdRowPatner = false;
  UpdRowCompet = false;
  ListDocStage: Array<OpenDocs>;
  ListDocResum: Array<OpenDocs>;

  constructor(
    private auth: AuthService,
    private service: OportunidadService,
    public toastService: ToastService
  ) {
    this.docSap = new OpportunitySAP();
    this.optsOpp = new OptionsHeaderOpp();
    this.optsTabGral = new OptionsTabGralOpp();
    this.ListDocStage = new Array<OpenDocs>();
    this.ListDocResum = new Array<OpenDocs>();
    this.OpenDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.PredDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.tEtOpenDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.tEtCloseDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  }
  ngOnInit() {
    this.createForm();
    this.onChangeDate();
    this.getOpsTabGral(2);
    this.isDisabled();
  }

  createForm() {
    this.formOpp = new FormGroup({
      OpprId:    new FormControl(this.docSap.Header.OpprId),
      CloPrcnt:  new FormControl(this.docSap.Header.CloPrcnt),
      Name:      new FormControl(this.docSap.Header.Name, Validators.required),
      OpenDate:  new FormControl(this.OpenDate, Validators.required),
      CloseDate: new FormControl( {value: this.CloseDate, disabled: true}),
      CardCode:  new FormControl(this.docSap.Header.CardCode, Validators.required),
      CardName:  new FormControl(this.docSap.Header.CardName),
      CprCode:   new FormControl(this.docSap.Header.CprCode),
      Territory: new FormControl(this.docSap.Header.Territory),
      SlpCode:   new FormControl(this.docSap.Header.SlpCode),
      SlpName:   new FormControl(this.docSap.Header.SlpName),
      Status:    new FormControl(this.docSap.Header.Status),
      DocType:   new FormControl(this.docSap.Header.DocType),
      DocNum:    new FormControl(this.docSap.Header.DocNum),
      ReasondId: new FormControl(this.docSap.Detail.TabResumen.ReasondId),
      TabPotencial: new FormGroup({
        PredDate:  new FormControl(this.PredDate),
        // MaxSumLoc: new FormControl(this.docSap.Detail.TabPotencial.MaxSumLoc, [Validators.required, Validators.min(1)])
        MaxSumLoc: new FormControl(this.docSap.Detail.TabPotencial.MaxSumLoc)
      }),
      TabGeneral: new FormGroup({
        PrjCode:   new FormControl(this.docSap.Detail.TabGeneral.PrjCode),
        Source:    new FormControl(this.docSap.Detail.TabGeneral.Source),
        Industry:  new FormControl(this.docSap.Detail.TabGeneral.Industry),
        Memo:      new FormControl(this.docSap.Detail.TabGeneral.Memo),
      }),
      tabEtapas: new FormGroup({
        LineNum:   new FormControl(this.docSap.Detail.TabEtapa.LineNum),
        SlpCode:   new FormControl(this.docSap.Detail.TabEtapa.SlpCode),
        Step_Id:    new FormControl(this.docSap.Detail.TabEtapa.Step_Id),
        WtSumLoc:  new FormControl(this.docSap.Detail.TabEtapa.WtSumLoc, [Validators.min(1)]),
        OpenDate:  new FormControl(this.tEtOpenDate),
        CloseDate: new FormControl(this.tEtCloseDate),
        ObjType:   new FormControl(this.docSap.Detail.TabEtapa.ObjType),
        DocNumber: new FormControl(this.docSap.Detail.TabEtapa.DocNumber),
      }),
      tabPartner: new FormGroup({
        Line:      new FormControl(this.docSap.Detail.TabPartner.Line),
        ParterId:  new FormControl(this.docSap.Detail.TabPartner.ParterId),
        Name:      new FormControl(this.docSap.Detail.TabPartner.Name),
        OrlCode:   new FormControl(this.docSap.Detail.TabPartner.OrlCode),
        OrlDesc:   new FormControl(this.docSap.Detail.TabPartner.OrlDesc),
        RelatCard: new FormControl(this.docSap.Detail.TabPartner.RelatCard),
        Memo:      new FormControl(this.docSap.Detail.TabPartner.Memo),
      }),
      tabCompetidores: new FormGroup({
        CompetId:   new FormControl(this.docSap.Detail.TabCompetidor.CompetId),
        NameCompet: new FormControl(this.docSap.Detail.TabCompetidor.NameCompet),
        ThreatLevi: new FormControl(this.docSap.Detail.TabCompetidor.ThreatLevi),
        Name:       new FormControl(this.docSap.Detail.TabCompetidor.Name),
        Won:        new FormControl(this.docSap.Detail.TabCompetidor.Won),
        Memo:       new FormControl(this.docSap.Detail.TabCompetidor.Memo),
      })
    });
  }

  // getter for easy access to form fields
  get f() { return this.formOpp.controls; }
  // getter for easy access to form Potential
  get tPot() { return this.formOpp.get('TabPotencial'); }
  // getter for easy access to form General
  get tGrl() { return this.formOpp.get('TabGeneral'); }
  // getter for easy access to tab stage
  get tE(): any { return this.formOpp.get('tabEtapas'); }
  // getter for easy access to tab partner
  get tP(): any { return this.formOpp.get('tabPartner'); }
  // getter for easy access to tab compet
  get tC(): any { return this.formOpp.get('tabCompetidores'); }

  // Get list to options document
  getOptions(type: number, cardCode: string, idOpp: number) {
    this.service.getOptionsHdOpp(this.auth.getToken(), type, cardCode, idOpp).subscribe(response => {
        this.optsOpp = response;
        this.createRow('E');
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener datos para el documento' : err.error
      });
    });
  }

  getOptionsToOpp(type: number, cardCode: string, idOpp: number) {
    this.service.getOptionsHdOpp(this.auth.getToken(), type, cardCode, idOpp).subscribe(response => {
      this.optsOpp = response;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener opciones para el documento' : err.error
      });
    });
  }

  isDisabled(): void {
    if (this.formOpp.get('Status').value === 'O') {
      this.formOpp.get('DocType').disable();
      this.formOpp.get('DocNum').disable();
      this.formOpp.get('ReasondId').disable();
      this.formOpp.get('CloseDate').patchValue('');
      this.f.ReasondId.reset();
      this.f.DocType.reset();
    } else if (this.formOpp.get('Status').value === 'W') {
      this.formOpp.get('DocType').disable();
      this.formOpp.get('DocNum').disable();
      this.formOpp.get('ReasondId').enable();
      this.formOpp.get('CloseDate').patchValue({ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() });
    } else if (this.formOpp.get('Status').value === 'L') {
      this.formOpp.get('DocType').disable();
      this.formOpp.get('DocNum').disable();
      this.formOpp.get('ReasondId').enable();
      this.formOpp.get('CloseDate').patchValue({ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() });
    }
  }

  // Get list to options detail document
  getOpsTabGral(type: number ) {
    this.service.getOptionsHdOpp(this.auth.getToken(), type, '', 0).subscribe(response => {
      this.optsTabGral = response;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener datos para la pestaña de General' : err.error
      });
    });
  }

  // lisen clic on list partner
  listenPartner(value: any) {
    console.log(this.f.OpprId.value);
    if (this.f.OpprId.value !== '' && this.f.OpprId.value !== null && this.f.OpprId.value > 0) { // Si estamos editando una oportunidad
        this.showDanger('El socio de negocios no puede ser modificado');
    } else { // Si estamos creando una oportunidad
      if (this.f.CardCode.value === '' || value.CardCode !== this.f.CardCode.value) { 
        this.formOpp.controls.CardCode.setValue(value.CardCode);
        this.formOpp.controls.CardName.setValue(value.CardName);
        this.formOpp.controls.SlpCode.setValue(value.SlpCode);
        this.docSap.Detail.TableEtapas = [];
        this.onResetStatus();
        this.getOptions(1, value.CardCode, 0);
      }
    }
  }
  // lisen clic on list opps
  listenOpps(value: any) {
    // section header to opportunity
    this.getOptionsToOpp(1, value.CardCode, value.OpprId);
    this.docSap.Header = value;
    this.formOpp.patchValue(value);
    this.progress = value.CloPrcnt;
    this.formOpp.get('OpenDate').patchValue(this.dateString(value.OpenDate));
    // seccion detail/tabs to opportunity
    this.getOpsTabGral(2);
    this.getDataTabsOppId(value.OpprId);
  }

  // get data tabs opportunity
  getDataTabsOppId(id: number) {
    this.service.getDataTabsOpp(this.auth.getToken(), 97, id).subscribe( response => {
      this.formOpp.get('TabPotencial').patchValue(response.TabPotencial);
      this.formOpp.get('TabPotencial.PredDate').patchValue(this.dateString(response.TabPotencial.PredDate));
      this.duration = response.TabPotencial.ClosePrev;
      this.formOpp.get('TabGeneral').patchValue(response.TabGeneral);
      this.docSap.Detail.TableEtapas = response.TableEtapas;
      this.docSap.Detail.TablePartner = response.TablePartner;
      this.docSap.Detail.TableCompet = response.TableCompet;
      this.formOpp.get('Status').patchValue(response.TabResumen.Status);
      this.formOpp.get('ReasondId').patchValue(response.TabResumen.ReasonId);
      this.formOpp.get('DocType').patchValue(response.TabResumen.DocType);
      this.formOpp.get('DocNum').patchValue(response.TabResumen.DocNum);
      this.tE.get('WtSumLoc').patchValue('');
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener datos para el documento' : err.error
      });
    });
  }
  // Create rows
  createRow(type: string, newObj: any = null) {
    switch (type) {
      case 'E': // Create row default in tab stage
        const obj = this.formOpp.controls;
        const ddEtapa = this.dropDownEtp(0, 'ED');
        const ddVende = this.dropDownEtp(this.formOpp.controls.SlpCode.value, 'V');
        this.docSap.Detail.TableEtapas.push({SlpCode: obj.SlpCode.value, SlpName: ddVende.SlpName , OpenDate: this.formatDate(this.tEtOpenDate, 'B'), CloseDate: this.formatDate(this.tEtCloseDate, 'B'), Step_Id: ddEtapa.StepId , Descript: ddEtapa.Descript , ClosePrcnt: ddEtapa.CloPrcnt, WtSumLoc: 0, ObjType: 0, DocNumber: 0, LineNum: -1, Status: 'O'});
        this.progressBar();
        break;
      case 'EN': // New row to tab stage
        const nObj = this.tE.value;
        const ddEt = this.dropDownEtp(newObj.Step_Id, 'E');
        const ddV = this.dropDownEtp(newObj.SlpCode, 'V');
        let nRow = { SlpCode: nObj.SlpCode, SlpName: ddV.SlpName , OpenDate: this.formatDate(nObj.OpenDate, 'B'), CloseDate: this.formatDate(nObj.CloseDate, 'B'), Step_Id: nObj.Step_Id , Descript: ddEt.Descript , ClosePrcnt: ddEt.CloPrcnt, WtSumLoc: nObj.WtSumLoc, ObjType: nObj.ObjType, DocNumber: nObj.DocNumber, LineNum: nObj.LineNum, Status: 'C' };
        this.docSap.Detail.TableEtapas.push(nRow);
        console.log(this.docSap.Detail.TableEtapas);
        this.progressBar();
        this.tE.reset();
        break;
      case 'P': // Create row partner
        const nObjP = this.tP.value;
        let index = this.docSap.Detail.TablePartner.findIndex(val => val.ParterId === nObjP.ParterId);
        if (index !== -1) {
            this.showDanger('El partner ya fue agregado');
            break;
        } else {
          const ddPt = this.dropDownEtp(nObjP.ParterId, 'P');
          const ddRl = this.dropDownEtp(nObjP.OrlCode, 'R');
          this.docSap.Detail.TablePartner.push({Line: -1, ParterId: nObjP.ParterId, Name: ddPt.Name, OrlCode: nObjP.OrlCode, OrlDesc: ddRl === undefined ? '' : ddRl.OrlDesc, RelatCard: nObjP.RelatCard, Memo: nObjP.Memo});
          this.tP.reset();
        }
        break;
      case 'C': // Create row compent
        const nObjC = this.tC.value;
        let idC = this.docSap.Detail.TableCompet.findIndex(val => val.CompetId === nObjC.CompetId);
        if (idC !== -1) {
          this.showDanger('El competidor ya fue agregado');
          break;
        } else {
          const ddCoN = this.dropDownEtp(nObjC.CompetId, 'C');
          const ddCAm = this.dropDownEtp(nObjC.ThreatLevi, 'A');
          this.docSap.Detail.TableCompet.push({ Line: nObjC.Line, CompetId: nObjC.CompetId, NameCompet: ddCoN.NameCompet, ThreatLevi: ddCAm.Code, Name: ddCoN.Name, Memo: nObjC.Memo, Won: nObjC.Won});
          this.tC.reset();
        }
        break;
      default:
        break;
    }

  }
  // updates rows stage
  updateRowEtp(type: string, obj: any = null) {
    const ddEtapa = this.dropDownEtp(obj.Step_Id, 'E');
    const ddVende = this.dropDownEtp(obj.SlpCode, 'V');
    let updRow = {SlpCode: obj.SlpCode, SlpName: ddVende.SlpName , OpenDate: this.formatDate(obj.OpenDate, 'B'), CloseDate: this.formatDate(obj.CloseDate, 'B'), Step_Id: obj.Step_Id , Descript: ddEtapa.Descript , ClosePrcnt: ddEtapa.CloPrcnt, WtSumLoc: obj.WtSumLoc, ObjType: obj.ObjType, DocNumber: obj.DocNumber, LineNum: obj.LineNum, Status: obj.Status };
    switch (type) {
      case 'URE': // update row stage
        let idx = this.docSap.Detail.TableEtapas.findIndex(val => val.LineNum === obj.LineNum);
        this.docSap.Detail.TableEtapas.splice(idx, 1, updRow);
        this.progressBar();
        this.onCancelUpdRow();
        break;
    }
  }

  onSelNewDateStage(): boolean {
    if (this.f.OpprId.value !== '' && this.f.OpprId.value !== null && this.f.OpprId.value > 0) {
      const lg = this.docSap.Detail.TableEtapas.length;
      const DatLastRow = new Date(this.docSap.Detail.TableEtapas[lg - 1].CloseDate.toString());
      const selDate = new Date(`${ this.tE.value.OpenDate.year}/${this.tE.value.OpenDate.month}/${this.tE.value.OpenDate.day}`.toString());
      if (selDate < DatLastRow) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  updateRowPartner(obj: any) {
    const ddPt = this.dropDownEtp(obj.ParterId, 'P');
    const ddRl = this.dropDownEtp(obj.OrlCode, 'R');
    let updRow = { Line: obj.Line, ParterId: obj.ParterId, Name: ddPt.Name, OrlCode: obj.OrlCode, OrlDesc: ddRl !== undefined ? ddRl.OrlDesc : '', RelatCard: obj.RelatCard, Memo: obj.Memo};
    let idx = -1;
    if (obj.Line !== -1) {
      idx = this.docSap.Detail.TablePartner.findIndex(val => val.ParterId === obj.ParterId && val.Line === obj.Line);
    } else {
      idx = this.docSap.Detail.TablePartner.findIndex(val => val.ParterId === obj.ParterId);
    }
    this.docSap.Detail.TablePartner.splice(idx, 1, updRow);
    this.onCancelUpdPtn();
  }

  updateRowCompet(obj: any) {
    const ddNam = this.dropDownEtp(obj.CompetId, 'C');
    const ddAme = this.dropDownEtp(obj.ThreatLevi, 'A');
    let updRow = { Line: obj.Line, CompetId: obj.CompetId, NameCompet: ddNam.NameCompet, ThreatLevi: ddAme.Code, Name: ddNam.Name, Memo: obj.Memo, Won: obj.Won};
    let idx = this.docSap.Detail.TableCompet.findIndex(val => val.CompetId === obj.CompetId);
    this.docSap.Detail.TableCompet.splice(idx, 1, updRow);
    this.onCancelUpdCom();
  }

  CreateOpp() {
    this.submitted = true;
    if (!this.formOpp.valid) {
      Swal.fire({
        title: 'Formulario invalido',
        icon: 'error',
        text: 'Datos invalidos para el formulario'
      });
      this.submitted = false;
      return;
    } else {
      const Opp = new OpportunitySAP();
      Opp.Header = this.formOpp.value;
      Opp.Header.OpenDate = this.formatDate(this.formOpp.value.OpenDate, 'A');
      Opp.Header.CloseDate = this.formOpp.value.CloseDate ? this.formatDate(this.formOpp.value.CloseDate, 'A') : null;
      Opp.Detail.TabPotencial = this.formOpp.controls['TabPotencial'].value;
      Opp.Detail.TabPotencial.PredDate = this.formatDate(this.tPot.value.PredDate, 'A');
      Opp.Detail.TabGeneral = this.formOpp.controls['TabGeneral'].value;
      Opp.Detail.TableEtapas = this.docSap.Detail.TableEtapas;
      Opp.Detail.TablePartner = this.docSap.Detail.TablePartner;
      Opp.Detail.TableCompet = this.docSap.Detail.TableCompet;
      this.service.createOpp(this.auth.getToken(), Opp, '').subscribe(response => {
        Swal.fire({
          title: 'Oportunidad creada',
          icon: 'success',
          text: String(response.Code)
        });
        this.onReset();
        this.childListOpps.refreshListOpps();
      }, (err) => {
        Swal.fire({
          title: 'Error al crear oportunidad',
          icon: 'error',
          text: err.error.ExceptionMessage ? err.error.ExceptionMessage : err.error
        });
        this.submitted = false;
      });
    }
  }

  UpdOpp() {
    this.submitted = true;
    if (!this.formOpp.valid) {
      Swal.fire({
        title: 'Formulario invalido',
        icon: 'error',
        text: 'Datos invalidos para el formulario'
      });
      this.submitted = false;
      return;
    } else {
      const Opp = new OpportunitySAP();
      Opp.Header = this.formOpp.value;
      Opp.Header.OpenDate = this.formatDate(this.formOpp.value.OpenDate, 'A');
      Opp.Header.CloseDate = this.formOpp.controls.CloseDate.value ? this.formatDate(this.formOpp.controls.CloseDate.value, 'A') : null;
      Opp.Detail.TabPotencial = this.formOpp.controls['TabPotencial'].value;
      Opp.Detail.TabPotencial.PredDate = this.formatDate(this.tPot.value.PredDate, 'A');
      Opp.Detail.TabGeneral = this.formOpp.controls['TabGeneral'].value;
      Opp.Detail.TableEtapas = this.docSap.Detail.TableEtapas;
      Opp.Detail.TablePartner = this.docSap.Detail.TablePartner;
      Opp.Detail.TableCompet = this.docSap.Detail.TableCompet;
      this.service.updateOpp(this.auth.getToken(), Opp, '').subscribe(response => {
        Swal.fire({
          title: 'Oportunidad actualizada',
          icon: 'success',
          text: String(response.Code)
        });
        this.onReset();
        this.childListOpps.refreshListOpps();
      }, (err) => {
        Swal.fire({
          title: 'Error al crear oportunidad',
          icon: 'error',
          text: err.error.ExceptionMessage ? err.error.ExceptionMessage : err.error
        });
        this.submitted = false;
      });
    }
  }

  CancelUpdOpp() {
    this.onReset();
  }
  // reset form
  private onReset() {
    this.submitted = false;
    this.formOpp.reset();
    this.docSap = new OpportunitySAP();
    this.formOpp.controls.OpenDate.setValue({ year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() });
    this.duration = 0;
    this.progress = 0;
  }

  onChangeDate(): void {
    const apertura = `${this.formOpp.controls.OpenDate.value.year}-${this.formOpp.controls.OpenDate.value.month}-${this.formOpp.controls.OpenDate.value.day}`;
    const cierre = `${this.tPot.value.PredDate.year}-${this.tPot.value.PredDate.month}-${this.tPot.value.PredDate.day}`;
    const cierreDate = new Date(cierre.toString()).getTime(); // - new Date(apertura.toString()).getTime();
    const apertDate = new Date(apertura.toString()).getTime();

    if (cierreDate < apertDate) { // Si la fecha de cierre es menor a la fecha de incio
      this.durationValid = -1;
    } else if (apertDate > cierreDate) { // Si la fecha de apertura es mayor a la fecha de cierre
      this.durationValid = 1;
    } else {
      const time = cierreDate - apertDate;
      this.durationValid = 0;
      this.duration = time / (1000 * 3600 * 24);
    }
  }

  onChangeDateEtp(type: string): void {
    if (this.tE.value.OpenDate !== null &&  this.tE.value.CloseDate !== null) {

      if (this.onSelNewDateStage()) {
        this.showDanger('La fecha no puede ser menor que la ultima etapa');
      } else {
        const inicio = `${ this.tE.value.OpenDate.year}-${this.tE.value.OpenDate.month}-${this.tE.value.OpenDate.day}`;
        const fin = `${this.tE.value.CloseDate.year}-${this.tE.value.CloseDate.month}-${this.tE.value.CloseDate.day}`;
        const dateStart = new Date(inicio.toString()).getTime(); // - new Date(apertura.toString()).getTime();
        const dateEnd = new Date(fin.toString()).getTime();
        if (dateStart > dateEnd) {
          this.duratValidEtp = -1;
        } else {
          this.duratValidEtp = 0;
        }
      }
    } else {
      this.duratValidEtp = -1;
    }
  }

  onChangeDocument(): void {
    this.tE.controls.DocNumber.reset();
    this.service.getListSelects(this.auth.getToken(), '1', this.tE.value.ObjType).subscribe(response => {
        this.ListDocStage = response;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener datos para el tipo de documento' : err.error
      });
    });
  }

  onChangeDocumentRes(): void {
    this.f.DocNum.reset();
    this.service.getListSelects(this.auth.getToken(), '1', this.formOpp.get('DocType').value).subscribe(response => {
      this.ListDocResum = response;
  }, (err) => {
    Swal.fire({
      title: 'Error',
      icon: 'error',
      text: err.status === 0 ? 'Error al obtener datos para el tipo de documento' : err.error
    });
  });
  }

  onChangePartner(id: number): void {
    let idx = this.optsTabGral.ListPartner.findIndex(val => val.ParterId === this.tP.value.ParterId);
    if (idx !== -1) {
      this.tP.get('RelatCard').patchValue(this.optsTabGral.ListPartner[idx].RelatCard);
    }
  }

  onChangeCompet(): void {
    let idx = this.optsTabGral.ListCompetidor.findIndex(val => val.CompetId === this.tC.value.CompetId);
    if (idx !== -1) {
      this.tC.get('ThreatLevi').patchValue(this.optsTabGral.ListCompetidor[idx].ThreatLevi);
      this.tC.get('Memo').patchValue(this.optsTabGral.ListCompetidor[idx].Memo);
    }
  }

  formatDate(date: NgbDateStruct, format: string = 'A'): Date {
    switch (format) {
      case 'A': // año-mes-día
        return new Date(`${date.year}-${date.month}-${date.day}`.toString());
      case 'B':
        return new Date(`${date.year}/${date.month}/${date.day}`.toString());
      default: // año-mes-día
        return new Date(`${date.year}-${date.month}-${date.day}`.toString());
    }
  }

  dateStruct(date: Date) {
      return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  dateString(dateString: string) {
    const date = new Date(dateString);
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }

  dropDownEtp(val: any, type: string): any {
    switch (type) {
      case 'E': // Etapa
        let i = this.optsTabGral.ListEtapa.findIndex(value => value.StepId === val);
        return this.optsTabGral.ListEtapa[i];
      case 'ED': // Etapa default
        return this.optsTabGral.ListEtapa[0];
      case 'V': // Vendedor
        let v = this.optsTabGral.ListVendedor.findIndex(value => value.SlpCode === val);
        return this.optsTabGral.ListVendedor[v];
      case 'P': // Partner
        let p = this.optsTabGral.ListPartner.findIndex(value => value.ParterId === val);
        return this.optsTabGral.ListPartner[p];
      case 'R': // relacion
        let r = this.optsTabGral.ListRelacion.findIndex(value => value.OrlCode === val);
        return this.optsTabGral.ListRelacion[r];
      case 'C': // Compent
        let c = this.optsTabGral.ListCompetidor.findIndex(value => value.CompetId === val);
        return this.optsTabGral.ListCompetidor[c];
      case 'A': // Amenazas
        let idA = this.ListAmenazas.findIndex(value => value.Code === val);
        return this.ListAmenazas[idA];
      default:
        break;
    }
  }

  progressBar() {
    if (this.docSap.Detail.TableEtapas.length === 1) {
      this.progress = this.docSap.Detail.TableEtapas[0].ClosePrcnt;
    } else {
      let index = this.docSap.Detail.TableEtapas.length - 1;
      this.progress = this.docSap.Detail.TableEtapas[index].ClosePrcnt;
    }
  }

  onClicRow(i: number): void {
    if (this.docSap.Detail.TableEtapas.length === 1) {
      // Editar
      this.UpdRowEtapa = true;
      this.setValuesFromRow(this.docSap.Detail.TableEtapas[i]);
    } else if ((this.docSap.Detail.TableEtapas.length - 1) === i) {
      // Editar
      this.UpdRowEtapa = true;
      this.setValuesFromRow(this.docSap.Detail.TableEtapas[i]);
    } else {
      // No Editar
      return;
    }
  }

  onClicRowPtn(i: number): void {
    this.UpdRowPatner = true;
    const tbPartn = this.docSap.Detail.TablePartner[i];
    this.tP.setValue({ Line: tbPartn.Line, ParterId: tbPartn.ParterId, Name: tbPartn.Name, OrlCode: tbPartn.OrlCode, OrlDesc: tbPartn.OrlDesc, RelatCard: tbPartn.RelatCard, Memo: tbPartn.Memo});
  }

  onClicRowComp(i: number): void {
    this.UpdRowCompet = true;
    const tbComp = this.docSap.Detail.TableCompet[i];
    this.tC.setValue({ CompetId: tbComp.CompetId, NameCompet: tbComp.NameCompet, ThreatLevi: tbComp.ThreatLevi, Name: tbComp.Name, Memo: tbComp.Memo, Won: tbComp.Won});
  }

  setValuesFromRow(Etps: Etapas): void {
    if (typeof Etps.OpenDate === 'string' && typeof Etps.CloseDate === 'string') {
      this.tE.setValue({LineNum: Etps.LineNum, SlpCode: Etps.SlpCode, Step_Id: Etps.Step_Id, WtSumLoc: Etps.WtSumLoc === undefined ? 0 : Etps.WtSumLoc, OpenDate: this.dateString(Etps.OpenDate), CloseDate: this.dateString(Etps.CloseDate), ObjType: Etps.ObjType, DocNumber: Etps.DocNumber === 0 ? '' : Etps.DocNumber });
    } else {
      this.tE.setValue({LineNum: Etps.LineNum, SlpCode: Etps.SlpCode, Step_Id: Etps.Step_Id, WtSumLoc: Etps.WtSumLoc === undefined ? 0 : Etps.WtSumLoc, OpenDate: this.dateStruct(Etps.OpenDate), CloseDate: this.dateStruct(Etps.CloseDate), ObjType: Etps.ObjType, DocNumber: Etps.DocNumber });
    }
  }

  onResetStatus(): void {
    this.tE.reset();
    this.UpdRowEtapa = false;
  }

  onCancelUpdRow(): void {
    this.UpdRowEtapa = false;
    this.tE.reset();
  }

  onCancelUpdPtn(): void {
    this.UpdRowPatner = false;
    this.tP.reset();
  }

  onCancelUpdCom(): void {
    this.UpdRowCompet = false;
    this.tC.reset();
  }

  showSuccess(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-success text-light', delay: 5000 });
  }

  showDanger(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-danger text-light', delay: 5000 });
  }
}
