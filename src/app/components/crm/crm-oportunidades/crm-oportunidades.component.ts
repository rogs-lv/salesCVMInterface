import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/authentication/auth.service';
import { OpportunitySAP, OptionsHeaderOpp, OptionsTabGralOpp, Etapas } from '../../../models/oportunidad';
import { OportunidadService } from '../../../services/oportunidades/oportunidad.service';
import { ReturnStatement } from '@angular/compiler';


@Component({
  selector: 'app-crm-oportunidades',
  templateUrl: './crm-oportunidades.component.html',
  styleUrls: ['./crm-oportunidades.component.css']
})
export class CrmOportunidadesComponent implements OnInit {

  docSap: OpportunitySAP;
  optsOpp: OptionsHeaderOpp;
  optsTabGral: OptionsTabGralOpp;
  formOpp: FormGroup;
  submitted = false;
  OpenDate: NgbDateStruct;
  PredDate: NgbDateStruct;
  duration: number;
  durationValid: number;
  ListTypeDoc = [{"Code": -1, "Name": ""}, {"Code": 23, "Name": "Cotización"}, {"Code": 17, "Name": "Pedido"}, {"Code": 15, "Name": "Entrega"}, {"Code": 13, "Name": "Factura de Venta"}, {"Code": 540000006, "Name": "Oferta de Compra"}, {"Code": 22, "Name": "Orden de Compra"}, {"Code": 20, "Name": "Pedido de entrada de mercancia"}, {"Code": 18, "Name": "Factura Proveedores"}];
  tEtOpenDate: NgbDateStruct;
  tEtCloseDate: NgbDateStruct;
  duratValidEtp: number;
  progress = 0;
  UpdRowEtapa = false;

  constructor(
    private auth: AuthService,
    private service: OportunidadService,
    private formBuilder: FormBuilder
  ) {
    this.docSap = new OpportunitySAP();
    this.optsOpp = new OptionsHeaderOpp();
    this.optsTabGral = new OptionsTabGralOpp();
    this.OpenDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.PredDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.tEtOpenDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.tEtCloseDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  }
  ngOnInit() {
    this.createForm();
    this.onChangeDate();
    this.getOpsTabGral(2);
  }

  createForm() {
    this.formOpp = this.formBuilder.group({
      cloPrcnt:     [this.docSap.Header.CloPrcnt],
      name:         [this.docSap.Header.Name, Validators.required],
      openDate:     [this.OpenDate, Validators.required],
      cardCode:     [this.docSap.Header.CardCode, Validators.required],
      cardName:     [this.docSap.Header.CardName],
      cprCode:      [this.docSap.Header.CprCode],
      territory:    [this.docSap.Header.Territory],
      slpCode:      [this.docSap.Header.SlpCode],
      slpName:      [this.docSap.Header.SlpName],
      predDate:     [this.PredDate],
      maxSumLoc:    [this.docSap.Detail.TabPotencial.MaxSumLoc, [Validators.required, Validators.min(1)]],
      prjCode:      [this.docSap.Detail.TabGeneral.PrjCode],
      source:       [this.docSap.Detail.TabGeneral.Source],
      industry:     [this.docSap.Detail.TabGeneral.Industry],
      memo:         [this.docSap.Detail.TabGeneral.Memo],
      status:       [this.docSap.Header.Status],
      docType:      [this.docSap.Header.DocType],
      docNum:       [this.docSap.Header.DocNum],
      // Tab etapas
      tEtSlpCode:   [this.docSap.Detail.TabEtapa.SlpCode],
      tEtStepId:    [this.docSap.Detail.TabEtapa.Step_Id],
      tEtWtSumLoc:  [this.docSap.Detail.TabEtapa.WtSumLoc],
      tEtOpenDate:  [this.tEtOpenDate], // [this.docSap.Detail.TabEtapa.OpenDate],
      tEtCloseDate: [this.tEtCloseDate], // [this.docSap.Detail.TabEtapa.CloseDate],
      tEtTypeDoc:   [this.docSap.Detail.TabEtapa.ObjType],
      tEtNoDoc:     [this.docSap.Detail.TabEtapa.DocNumber],
      tEtTable:     [this.docSap.Detail.TableEtapas],
      // Tab Partner
      tPtParterId:  [this.docSap.Detail.TabPartner.ParterId],
      tPtOrlCode:   [this.docSap.Detail.TabPartner.OrlCode],
      tPtRelatCard: [this.docSap.Detail.TabPartner.RelatCard],
      tPtMemo:      [this.docSap.Detail.TabPartner.Memo],
      // Tab Competidores
      tCoCompetId:   [this.docSap.Detail.TabCompetidor.CompetId],
      tCoThreatLevi: [this.docSap.Detail.TabCompetidor.ThreatLevi],
      tCoWon:        [this.docSap.Detail.TabCompetidor.Won],
      tCoMemo:       [this.docSap.Detail.TabCompetidor.Memo],
      // Tab Razones
      tReReasondId:  [this.docSap.Detail.TabResumen.ReasondId],
    });
  }

  // getter for easy access to form fields
  get f() { return this.formOpp.controls; }

  getOptions(type: number, cardCode: string) {
    this.service.getOptionsHdOpp(this.auth.getToken(), type, cardCode).subscribe(response => {
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

  getOpsTabGral(type: number ) {
    this.service.getOptionsHdOpp(this.auth.getToken(), type, '').subscribe(response => {
      this.optsTabGral = response;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener datos para la pestaña de General' : err.error
      });
    });
  }

  listenPartner(value: any) {
    this.formOpp.controls.cardCode.setValue(value.CardCode);
    this.formOpp.controls.cardName.setValue(value.CardName);
    this.formOpp.controls.slpCode.setValue(value.SlpCode);
    this.getOptions(1, value.CardCode);
  }
  // Create rows stages
  createRow(type: string, newObj: any = null) {
    switch (type) {
      case 'E': // Create row default in tab stage
        const obj = this.formOpp.controls;
        const ddEtapa = this.dropDownEtp(0, 'ED');
        const ddVende = this.dropDownEtp(this.formOpp.controls.slpCode.value, 'V');
        this.docSap.Detail.TableEtapas.push({SlpCode: obj.slpCode.value, SlpName: ddVende.SlpName , OpenDate: this.formatDate(this.tEtOpenDate, 'B'), CloseDate: this.formatDate(this.tEtCloseDate, 'B'), Step_Id: ddEtapa.StepId , Descript: ddEtapa.Descript , ClosePrcn: ddEtapa.CloPrcnt, WtSumLoc: obj.tEtWtSumLoc.value, ObjType: 0, DocNumber: 0, LineNum: -1});
        this.progressBar();
        break;
      case 'EN': // New row to tab stage
        this.docSap.Detail.TableEtapas.push(newObj);
        this.progressBar();
        break;
      default:
        break;
    }

  }
  // updates rows stage
  updateRowEtp(type: string, updObj: any = null) {
    switch (type) {
      case 'URE': // update row stage
        let idx = this.docSap.Detail.TableEtapas.findIndex(val => val.LineNum === updObj.LineNum);
        this.docSap.Detail.TableEtapas.splice(idx, 1, updObj);
        break;
    }
  }

  CreateOpp() {
    // console.log(this.formOpp.controls);
    console.log(this.docSap.Detail.TableEtapas);
  }
  // reset form
  onReset() {
    /* this.submitted = false;
    this.formOpp.reset(); */
  }

  onChangeDate(): void {
    const apertura = `${this.formOpp.controls.openDate.value.year}-${this.formOpp.controls.openDate.value.month}-${this.formOpp.controls.openDate.value.day}`;
    const cierre = `${this.formOpp.controls.predDate.value.year}-${this.formOpp.controls.predDate.value.month}-${this.formOpp.controls.predDate.value.day}`;
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

  onChangeDateEtp(): void {
    const inicio = `${this.formOpp.controls.openDate.value.year}-${this.formOpp.controls.openDate.value.month}-${this.formOpp.controls.openDate.value.day}`;
    const fin = `${this.formOpp.controls.predDate.value.year}-${this.formOpp.controls.predDate.value.month}-${this.formOpp.controls.predDate.value.day}`;
    const dateStart = new Date(inicio.toString()).getTime(); // - new Date(apertura.toString()).getTime();
    const dateEnd = new Date(fin.toString()).getTime();
    if (dateStart > dateEnd) {
      this.duratValidEtp = -1;
    } else if(dateEnd > dateStart) {
      this.duratValidEtp = 0;
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

  dropDownEtp(val: any, type: string): any {
    switch (type) {
      case 'E': // Etapa
        console.log(val);
        let i = this.optsTabGral.ListEtapa.findIndex(value => value.StepId === val);
        return this.optsTabGral.ListEtapa[i];
      case 'ED': // Etapa default
        return this.optsTabGral.ListEtapa[0];
      case 'V': // Vendedor
        let v = this.optsTabGral.ListVendedor.findIndex(value => value.SlpCode === val);
        return this.optsTabGral.ListVendedor[v];
      default:
        break;
    }
  }

  progressBar() {
    if (this.docSap.Detail.TableEtapas.length === 1) {
      this.progress = this.docSap.Detail.TableEtapas[0].ClosePrcn;
    } else {
      let index = this.docSap.Detail.TableEtapas.length - 1;
      this.progress = this.docSap.Detail.TableEtapas[index].ClosePrcn;
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

  setValuesFromRow(Etps: Etapas): void {
    this.formOpp.controls.tEtOpenDate.setValue(this.dateStruct(Etps.OpenDate));
    this.formOpp.controls.tEtCloseDate.setValue(this.dateStruct(Etps.CloseDate));
    this.formOpp.controls.tEtSlpCode.setValue(Etps.SlpCode);
    this.formOpp.controls.tEtStepId.setValue(Etps.Step_Id);
    this.formOpp.controls.tEtWtSumLoc.setValue(Etps.WtSumLoc);
    this.formOpp.controls.tEtTypeDoc.setValue(Etps.ObjType);
    this.formOpp.controls.tEtNoDoc.setValue(Etps.DocNumber);
  }


}
