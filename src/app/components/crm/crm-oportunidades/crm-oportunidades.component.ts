import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/authentication/auth.service';
import { OpportunitySAP, OptionsHeaderOpp, OptionsTabGralOpp } from '../../../models/oportunidad';
import { OportunidadService } from '../../../services/oportunidades/oportunidad.service';


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
  }
  ngOnInit() {
    this.createForm();
    this.onChangeDate();
    this.getOpsTabGral(2);
  }

  createForm() {
    this.formOpp = this.formBuilder.group({
      name:       [this.docSap.Header.Name, Validators.required],
      openDate:   [this.OpenDate, Validators.required],
      cardCode:   [this.docSap.Header.CardCode, Validators.required],
      cardName:   [this.docSap.Header.CardName],
      cprCode:    [this.docSap.Header.CprCode],
      territory:  [this.docSap.Header.Territory],
      slpCode:    [this.docSap.Header.SlpCode],
      predDate:   [this.PredDate],
      maxSumLoc:  [this.docSap.Detail.TabPotencial.MaxSumLoc, [Validators.required, Validators.min(1)]],
      prjCode:    [this.docSap.Detail.TabGeneral.PrjCode],
      source:     [this.docSap.Detail.TabGeneral.Source],
      industry:   [this.docSap.Detail.TabGeneral.Industry],
      memo:       [this.docSap.Detail.TabGeneral.Memo]
    });
  }

  // getter for easy access to form fields
  get f() { return this.formOpp.controls; }

  getOptions(type: number, cardCode: string) {
    this.service.getOptionsHdOpp(this.auth.getToken(), type, cardCode).subscribe(response => {
        this.optsOpp = response;
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
    this.getOptions(1, value.CardCode);
  }

  CreateOpp() {
    console.log(this.formOpp.controls);
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
}
