import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, NgForm } from '@angular/forms';

import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ToastService } from 'src/app/services/toasts/toast.service';

import { ActividadService } from '../../../services/actividades/actividad.service';
import { AuthService } from 'src/app/services/authentication/auth.service';

import { Actividad, ActivitySAP, DropDownActivity, PersonasAct, OportunidadAct, Stage } from 'src/app/models/actividad';
import { ListaActivityComponent } from '../shared/lista-activity/lista-activity.component';

@Component({
  selector: 'app-crm-actividades',
  templateUrl: './crm-actividades.component.html',
  styleUrls: ['./crm-actividades.component.css']
})
export class CrmActividadesComponent implements OnInit {
  @ViewChild(ListaActivityComponent, {static: true}) childListAct: ListaActivityComponent;

  ListTipo: Array<DropDownActivity>;
  ListAsunto: Array<DropDownActivity>;
  ListLocalidad: Array<DropDownActivity>;
  ListOppAct: Array<OportunidadAct>;
  ListStageAct: Array<Stage>;
  ListPersonas: Array<PersonasAct>;
  ListActividad = [ { Code: 'C', Name: 'Llamada teléfonica' }, { Code: 'M', Name: 'Reunion' }, { Code: 'T', Name: 'Tarea'}, { Code: 'E', Name: 'Nota'}, { Code: 'P', Name: 'Campaña'}, { Code: 'N', Name: 'Otra'}] ;
  ListPrioridad = [ { Code: 1, Name: 'Bajo' }, { Code: 2, Name: 'Normal' }, { Code: 3, Name: 'Alto' }];
  document: ActivitySAP;

  CardName = '';
  Duration: string;
  Recontact = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  BeginTime = { hour: new Date().getHours(), minute: new Date().getMinutes() };
  endDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  ENDTime = { hour: new Date().getHours(), minute: new Date().getMinutes() };

  submit = false;
  edit = false;

  constructor(
    private servicio: ActividadService,
    private auth: AuthService,
    private toastService: ToastService
  ) {
    this.document = new ActivitySAP();
    this.ListTipo = [];
    this.ListAsunto = [];
    this.ListLocalidad = [];
  }

  ngOnInit() {
    this.getOptionsActivity();
  }

  // Event lisener
  onLisenPartner(value: any) {
    this.document.CardCode = value.CardCode;
    this.CardName = value.CardName;
    this.getContacts(value.CardCode);
    this.document.Action = this.ListActividad[0].Code;
    this.getOpps();
  }

  onListenActivity(value: Actividad) {
    this.document = new ActivitySAP();
    this.edit = true;
    this.getActivityId(value.ClgCode);
  }

  onChangeContact() {
    const x = this.ListPersonas.findIndex(val => val.CntctCode === this.document.CntctCode);
    if (x !== -1) {
      this.document.Tel = this.ListPersonas[x].Tel1;
    }
  }
  // get data to drop down
  getOptionsActivity() {
    this.servicio.getOptionsActivity(this.auth.getToken(), 1).subscribe(response => {
      this.ListTipo = response.ListTipo;
      this.ListAsunto = response.ListAsunto;
      this.ListLocalidad = response.ListLocalidad;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener datos para las opciones de la actividad' : err.error
      });
    });
  }

  // get contact to partner
  getContacts(cardcode: string, def: string = 'Y'): void {
    this.servicio.getContacsActivity(this.auth.getToken(), cardcode).subscribe(response => {
      this.ListPersonas = response;
      if (this.ListPersonas.length > 0 && def === 'Y') {
        this.document.CntctCode = this.ListPersonas[0].CntctCode;
        this.document.Tel = this.ListPersonas[0].Tel1;
      }
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener contactos del socio de negocios' : err.error
      });
    });
  }

  // get data to relation activity with opportunity
  getOpps() {
    this.servicio.getOpps(this.auth.getToken(), 97).subscribe(response => {
      this.ListOppAct = response;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener oportunidades para la actividad' : err.error
      });
    });
  }

  // get activity id
  getActivityId(idDoc: number) {
    this.servicio.getActivityId(this.auth.getToken(), idDoc).subscribe(response => {
      this.getContacts(response.CardCode, 'N');
      this.CardName = response.CardName;
      this.setNgDate(response.Recontact, response.endDate);
      this.setNgTime(response.BeginTime, response.ENDTime);
      this.getOpps();
      this.onChangeDocumentOpp();
      this.document.OprLine = response.OprLine;
      this.document =  response;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? `Error la actividad: ${idDoc}` : err.error
      });
    });
  }

  setNgDate(dateIni: string, dateFin: string) {
    const val = new Date(dateIni);
    const valF = new Date(dateFin);
    this.Recontact = { year: val.getFullYear(), month: val.getMonth() + 1, day: val.getDate() };
    this.endDate = { year: valF.getFullYear(), month: valF.getMonth() + 1, day: valF.getDate() };
  }

  setNgTime(valI: number, valF: number) {
    if (valI.toString().length === 4) {
      const timeI = moment(valI, 'HHmmss').format('HH:mm:ss').split(':');
      // tslint:disable-next-line: radix
      this.BeginTime = { hour: parseInt(timeI[0]), minute: parseInt(timeI[1]) };
    } else { // es igual a 3
      const hI = valI.toString().substring(0, 1);
      const mI = valI.toString().substring(1, 3);
      const timeI = moment(`${hI}:${mI}`.toString(), 'HHmmss').format('H:mm:ss').split(':');
      // tslint:disable-next-line: radix
      this.BeginTime = { hour: parseInt(timeI[0]), minute: parseInt(timeI[1]) };
    }

    if (valF.toString().length === 4) {
      const timeF = moment(valF, 'HHmmss').format('HH:mm:ss').split(':');
      // tslint:disable-next-line: radix
      this.ENDTime = { hour: parseInt(timeF[0]), minute: parseInt(timeF[1]) };
    } else { // es igual a 3
      const hF = valF.toString().substring(0, 1);
      const mF = valF.toString().substring(1, 3);
      const timeF = moment(`${hF}:${mF}`, 'HHmmss').format('H:mm:ss').split(':');
      // tslint:disable-next-line: radix
      this.ENDTime = { hour: parseInt(timeF[0]), minute: parseInt(timeF[1]) };
    }
  }

  // events
  onChangeDateBegin(event) {
    const fechaInicio = moment(`${event.day}/${event.month}/${event.year}`.toString(), 'DD/MM/YYYY');
    const fechaFin = moment(`${this.endDate.day}/${this.endDate.month}/${this.endDate.year}`.toString(), 'DD/MM/YYYY');
    if (fechaFin.isBefore(fechaInicio)) {
      this.endDate = { year: event.year, month: event.month, day: event.day };
    }
    // this.calcDuration();
  }

  onChangeDateEnd(event) {
    const fechaInicio = moment(`${this.Recontact.day}/${this.Recontact.month}/${this.Recontact.year}`.toString(), 'DD/MM/YYYY');
    const fechaFin = moment(`${event.day}/${event.month}/${event.year}`.toString(), 'DD/MM/YYYY');
    if (fechaInicio.isAfter(fechaFin)) {
      this.Recontact = { year: event.year, month: event.month, day: event.day };
    }
    // this.calcDuration();
  }

  onChangeTimeInicio(event) {
    // si la fecha de inicio es mayor que la fin, actualizamos la de fin
    const horaInicio = moment(`${event.hour}:${event.minute}`.toString(), 'HH:mm a');
    const horaFin = moment(`${this.ENDTime.hour}:${this.ENDTime.minute}`.toString(), 'HH:mm a');
    if (horaFin.isBefore(horaInicio)) {
      this.ENDTime = { hour: event.hour, minute: (event.minute + 15) };
    }
    // this.calcDuration();
  }

  onChangeTimeFin(event) {
    // si la fecha de fin es menor que la de inicio indicamos un error
    const horaInicio = moment(`${this.BeginTime.hour}:${this.BeginTime.minute}`.toString(), 'HH:mm a');
    const horaFin = moment(`${event.hour}:${event.minute}`.toString(), 'HH:mm a');
    if (horaInicio.isAfter(horaFin)) {
      this.BeginTime = { hour: event.hour, minute: event.minute };
    }
    // this.calcDuration();
  }

  calcDuration() {
    const fechaHoraInicio = moment(`${this.Recontact.day}/${this.Recontact.month}/${this.Recontact.year} ${this.BeginTime.hour}:${this.BeginTime.minute}:00`.toString(), 'DD/MM/YYYY hh:mm:ss a');
    const fechaHoraFin = moment(`${this.endDate.day}/${this.endDate.month}/${this.endDate.year} ${this.ENDTime.hour}:${this.ENDTime.minute}:00`.toString(), 'DD/MM/YYYY hh:mm:ss a');
    const dd = moment.duration(fechaHoraFin.diff(fechaHoraInicio));
    this.Duration = `${dd.days()} ${dd.hours()}:${dd.minutes()}`.toString();
  }

  onChangeDocumentOpp() {
    if (this.document.OprId) {
      this.servicio.getOpps(this.auth.getToken(), 8, this.document.OprId).subscribe(response => {
        this.ListStageAct = response;
      }, (err) => {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: err.status === 0 ? 'Error al obtener etapas para la actividad' : err.error
        });
      });
    } else {
      this.document.OprLine = null;
      this.ListStageAct = [];
    }
  }

  // methods
  onCancelActivity() {
    this.edit = false;
    this.CardName = '';
    this.onReset();
  }

  onUpdateActivity(frmAct: NgForm) {
    if (frmAct.invalid) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Formulario no valido'
      });
    } else {
      this.submit = true;
      this.setFecha(this.Recontact, this.endDate, this.BeginTime, this.ENDTime);
      this.servicio.patchActivity(this.auth.getToken(), this.auth.getDataToken().Code, this.document).subscribe(response => {
        Swal.fire({
          title: 'Actividad Actualizada',
          icon: 'success',
          text: String(response.Code)
        });
        this.submit = false;
        this.CardName = '';
        this.onReset();
        this.childListAct.refreshListActs();
      }, (err) => {
        this.submit = false;
        this.edit = false;
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: err.status === 0 ? 'Error al actualizar actvidad' : err.error
        });
      });
    }
  }

  onCreateActivity(frmAct: NgForm) {
    if (frmAct.invalid) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'Formulario no valido'
      });
    } else {
      this.submit = true;
      this.setFecha(this.Recontact, this.endDate, this.BeginTime, this.ENDTime);
      this.servicio.postActivity(this.auth.getToken(), this.auth.getDataToken().Code, this.document ).subscribe(response => {
        Swal.fire({
          title: 'Actividad Creado',
          icon: 'success',
          text: String(response.Code)
        });
        this.submit = false;
        this.CardName = '';
        this.onReset();
        this.childListAct.refreshListActs();
      }, (err) => {
        this.submit = false;
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: err.status === 0 ? 'Error al crear actvidad' : err.error
        });
      });
    }
  }

  setFecha(recon: any, edDate: any, bgTim: any, edTim: any) {
    this.document.Recontact = moment(`${recon.day}/${recon.month}/${recon.year}`.toString(), 'DD/MM/YYYY').utc().format('YYYY-MM-DD');
    this.document.endDate = moment(`${edDate.day}/${edDate.month}/${edDate.year}`.toString(), 'DD/MM/YYYY').utc().format('YYYY-MM-DD');
    this.document.BeginTime = `${this.pad(bgTim.hour)}:${this.pad(bgTim.minute)}:00`.toString();
    this.document.ENDTime = `${this.pad(edTim.hour)}:${this.pad(edTim.minute)}:00`.toString();
  }
  // arrow function
  pad = (i: number): string => i < 10 ? `0${i}` : `${i}`;

  // toast
  showSuccess(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-success text-light', delay: 5000 });
  }

  showDanger(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-danger text-light', delay: 5000 });
  }

  onReset() {
    this.document = new ActivitySAP();
    this.Recontact = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.BeginTime = { hour: new Date().getHours(), minute: new Date().getMinutes() };
    this.endDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    this.ENDTime = { hour: new Date().getHours(), minute: new Date().getMinutes() };
  }
}
