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

  constructor(
    private auth: AuthService,
    private service: OportunidadService,
    public toastService: ToastService
  ) {
  }

  ngOnInit() {

  }

}
