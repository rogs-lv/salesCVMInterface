import { Component, IterableDiffers, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, NgForm } from '@angular/forms';

import { AgGridAngular } from 'ag-grid-angular';
import { AuthService } from '../../../services/authentication/auth.service';

import { MtrDataService } from '../../../services/masterData/mtr-data.service';
import Swal from 'sweetalert2';
import { BP, Direcciones, SocioNegocios } from 'src/app/models/socioNegocios';
import { ToastService } from 'src/app/services/toasts/toast.service';


@Component({
  selector: 'app-sociosnegocios',
  templateUrl: './sociosnegocios.component.html',
  styleUrls: ['./sociosnegocios.component.css']
})
export class SociosnegociosComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('agGrid', {static: true}) agGrid: AgGridAngular;

  Partner: SocioNegocios;
  Series: Array<string> = ['Manual'];
  CardTypes = [{ Code: 'C', Name: 'Cliente'}, { Code: 'S', Name : 'Vendedor'}, { Code: 'L', Name: 'Lead'}];
  Currencies = [ {CurrCode: 'MXP', CurrName: 'Peso Méxicando'}, {CurrCode: 'USD', CurrName: 'US Dolar'}, {CurrCode: 'EUR', CurrName: 'Euro'}, {CurrCode: 'CAN', CurrName: 'Canadian Dollar'}, {CurrCode: '##', CurrName: 'Monedas (todas)'}];
  AdresTypes = [{Code: 'S', Name: 'Entrega'}, {Code: 'B', Name: 'Facturación'}];
  States = [];
  Countrys = [];
  BusnessP: BP;
  DireccionesFac: Array<Direcciones>;
  DireccionesEnt: Array<Direcciones>;
  Direccion: Direcciones;
  EstadoForm = 'N';
  EstadoDir = 'N';

  constructor(
    private mkService: MtrDataService,
    private auth: AuthService,
    public toastService: ToastService
  ) {
    this.Partner = new SocioNegocios();
    this.BusnessP = new BP();
    this.DireccionesFac = new Array<Direcciones>();
    this.DireccionesEnt = new Array<Direcciones>();
    this.Direccion = new Direcciones();
  }

  ngOnInit() {
    this.getDestinos();
  }
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
  }
  ngOnChanges() {
  }

  listenBP(value: any) {
    this.EstadoForm = 'E';
    value.Series = this.Series[0];
    this.Partner = value;
    this.Direccion = new Direcciones();
    this.getDireccionesSocio(this.Partner.CardCode);
  }

  getDireccionesSocio(cardcode: string) {
    this.mkService.getInformacionSocio(this.auth.getToken(), 2, cardcode).subscribe(response => {
      if (response !== null) {
        // this.Direcciones = response;
        this.DireccionesFac = this.filtrarDirecciones('B', response);
        this.DireccionesEnt = this.filtrarDirecciones('S', response);
      }
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener dirección del socio de negocios' : err.error
      });
    });
  }
  filtrarDirecciones(tipo: string, values: Array<Direcciones>) {
    let newArray = [];
    for (const key in values) {
      if (values[key].AdresType === tipo) {
        newArray.push(values[key]);
      }
    }
    return newArray;
  }

  getDestinos() {
    this.mkService.getDestinos(this.auth.getToken()).subscribe(response => {
      if (response !== null) {
        this.Countrys = response.country;
        this.States = response.state;
      }
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener destinos para socio de negocios' : err.error
      });
    });
  }

  editarDireccion(value: Direcciones) {
    this.EstadoDir = 'E';
    this.Direccion = value;
  }

  actualizarDireccion(value: Direcciones, tipo: string) {
    /* this.EstadoDir = 'N';
    let index = this.Direcciones.findIndex(el => el.Address === value.Address);
    this.Direcciones.splice(index, 1, value);
    this.Direccion = new Direcciones();
    this.showSuccess('Dirección actualizada'); */
    if (tipo === 'B') {
      let index = this.DireccionesFac.findIndex(el => el.Address === value.Address);
      this.DireccionesFac.splice(index, 1, value);
      this.Direccion = new Direcciones();
      this.showSuccess('Dirección actualizada');
    } else {
      let index = this.DireccionesEnt.findIndex(el => el.Address === value.Address);
      this.DireccionesEnt.splice(index, 1, value);
      this.Direccion = new Direcciones();
      this.showSuccess('Dirección actualizada');
    }
  }

  cancelActDireccion() {
    this.EstadoDir = 'N';
    this.Direccion = new Direcciones();
  }

  nuevaDireccion(value: Direcciones, tipo: string) {
    if (value.Address === null || value.Address === '') {
      this.showDanger('Debe ingresar almenos un nombre');
      return false;
    }
    if (tipo === 'B') {
      for (const key in this.DireccionesFac) {
        if (this.DireccionesFac[key].Address === value.Address) {
          this.showDanger('El Id de la dirección ya existe');
          return false;
        }
      }
      this.DireccionesFac.push(value);
      this.showSuccess('Dirección agregada');
      this.Direccion = new Direcciones();
    } else {
      for (const key in this.DireccionesEnt) {
        if (this.DireccionesEnt[key].Address === value.Address) {
          this.showDanger('El Id de la dirección ya existe');
          return false;
        }
      }
      this.DireccionesEnt.push(value);
      this.showSuccess('Dirección agregada');
      this.Direccion = new Direcciones();
    }
    // this.Direcciones = this.Direcciones.concat([value]);
    // this.Direcciones.push(value);
  }
  eliminarDireccion(tipo: string, index: number) {
    if (tipo === 'B') {
      this.DireccionesFac.splice(index, 1);
      this.Direccion = new Direcciones();
      this.EstadoDir = 'N';
    } else {
      this.DireccionesEnt.splice(index, 1);
      this.Direccion = new Direcciones();
      this.EstadoDir = 'N';
    }
  }
  cambiarEstados(val) {
  // console.log(val);
  }

  btnNuevoSocio() {
    this.EstadoForm = 'N';
  }
  CancelarEdicionSocio() {
    this.EstadoForm = 'N';
    this.EstadoDir = 'N';
    this.Partner = new SocioNegocios();
    this.Direccion = new Direcciones();
    this.DireccionesFac = new Array<Direcciones>();
    this.DireccionesEnt = new Array<Direcciones>();
  }
  ActualizarSocio(frmUpdate: NgForm) {
    console.log('Actualizar socio', frmUpdate);
  }

  CrearSocio(header: SocioNegocios, DirF: Array<Direcciones>, DirE: Array<Direcciones>) {
    console.log('Crear socio', header, DirF, DirE);
  }

  showSuccess(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-success text-light', delay: 10000 });
  }

  showDanger(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-danger text-light', delay: 15000 });
  }
}
