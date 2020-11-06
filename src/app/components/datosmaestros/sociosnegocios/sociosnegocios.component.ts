import { Component, IterableDiffers, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Form, NgForm } from '@angular/forms';

import { AgGridAngular } from 'ag-grid-angular';
import { AuthService } from '../../../services/authentication/auth.service';

import { MtrDataService } from '../../../services/masterData/mtr-data.service';
import Swal from 'sweetalert2';
import { BP, Contacto, Direcciones, FormaPago, MetodoPago, SocioNegocios } from 'src/app/models/socioNegocios';
import { ToastService } from 'src/app/services/toasts/toast.service';
import { ListasociosComponent } from '../shared/listasocios/listasocios.component';


@Component({
  selector: 'app-sociosnegocios',
  templateUrl: './sociosnegocios.component.html',
  styleUrls: ['./sociosnegocios.component.css']
})
export class SociosnegociosComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('agGrid', {static: true}) agGrid: AgGridAngular;
  @ViewChild(ListasociosComponent, {static: true}) childList: ListasociosComponent;

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
  PrsContacto: Array<Contacto>;
  Contacto: Contacto;
  EstadoForm = 'N';
  EstadoDir = 'N';
  EstadoCnt = 'N';
  proceso: boolean;
  FormasPago: Array<FormaPago>;
  MetodosPago: Array<MetodoPago>;
  Impuestos: [];

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
    this.PrsContacto = new Array<Contacto>();
    this.Contacto = new Contacto();
    this.proceso = false;
    this.FormasPago = new Array<FormaPago>();
    this.MetodosPago = new Array<MetodoPago>();
  }

  ngOnInit() {
    this.getDestinos();
    this.getPagos();
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
    this.Contacto = new Contacto();
    this.getDireccionesSocio(this.Partner.CardCode);
    this.getContactosSocio(this.Partner.CardCode);
  }

  getDireccionesSocio(cardcode: string) {
    this.DireccionesFac = [];
    this.DireccionesEnt = [];
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
  getContactosSocio(cardcode: string) {
    this.PrsContacto = [];
    this.mkService.getInformacionSocio(this.auth.getToken(), 5, cardcode).subscribe(response => {
      this.PrsContacto = response;
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
        this.Impuestos = response.impuestos;
      }
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener destinos para socio de negocios' : err.error
      });
    });
  }

  getPagos() {
    this.mkService.getPagos(this.auth.getToken(), 3).subscribe(response => {
      if (response !== null) {
        this.FormasPago = response.FormaPago;
        this.MetodosPago = response.MetodoPago;
      }
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'Error al obtener pagos para socio de negocios' : err.error
      });
    });
  }
  getNumeracion(subtype: string) {
    if (this.EstadoForm === 'E') {
      return;
    }
    if (subtype === '') {
      return;
    } else {
      this.mkService.getNumeracion(this.auth.getToken(), '2', subtype).subscribe(response => {
        if (response !== null) {
          this.Partner.Serie = response.Series;
          this.Partner.CardCode = response.Code;
        }
      }, (err) => {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          text: err.status === 0 ? 'Error al obtener la numeración para socio de negocios' : err.error
        });
      });
    }
  }

  editarDireccion(value: Direcciones) {
    this.EstadoDir = 'E';
    this.Direccion = value;
  }
  editarContacto(value: Contacto) {
    this.EstadoCnt = 'E';
    this.Contacto = value;
  }
  actualizarDireccion(value: Direcciones, tipo: string) {
    if (tipo === 'B') {
      let index = this.DireccionesFac.findIndex(el => el.Address === value.Address);
      this.DireccionesFac.splice(index, 1, value);
      this.Direccion = new Direcciones();
      this.showSuccess('Dirección actualizada');
      this.EstadoDir = 'N';
    } else {
      let index = this.DireccionesEnt.findIndex(el => el.Address === value.Address);
      this.DireccionesEnt.splice(index, 1, value);
      this.Direccion = new Direcciones();
      this.showSuccess('Dirección actualizada');
      this.EstadoDir = 'N';
    }
  }

  actualizarCnt(value: Contacto) {
    let index = this.PrsContacto.findIndex(el => el.Address === value.Address);
    this.PrsContacto.splice(index, 1, value);
    this.Contacto = new Contacto();
    this.showSuccess('Contacto actualizado');
    this.EstadoCnt = 'N';
  }

  cancelActDireccion() {
    this.EstadoDir = 'N';
    this.Direccion = new Direcciones();
  }

  cancelActCnt() {
    this.EstadoCnt = 'N';
    this.Contacto = new Contacto();
  }

  nuevaDireccion(value: Direcciones, tipo: string) {
    if (value.Address === null || value.Address === '') {
      this.showDanger('Debe ingresar al menos un nombre');
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
  }

  nuevoCnt(value: Contacto) {
    if (value.Name === null || value.Name === '') {
      this.showDanger('Debe ingresar al menos un nombre');
      return false;
    }
    for (const key in this.PrsContacto) {
      if (this.PrsContacto[key].Name === value.Name) {
        this.showDanger('El Id del contacto ya existe');
        return false;
      }
    }
    this.PrsContacto.push(value);
    this.showSuccess('Contacto agregado');
    this.Contacto = new Contacto();
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
    // console.log('cancelar', this.Partner.CardType);
    this.EstadoForm = 'N';
    this.EstadoDir = 'N';
    this.Partner = new SocioNegocios();
    this.Direccion = new Direcciones();
    this.DireccionesFac = new Array<Direcciones>();
    this.DireccionesEnt = new Array<Direcciones>();
    this.PrsContacto = new Array<Contacto>();
  }
  ActualizarSocio(frm: NgForm, header: SocioNegocios, DirF: Array<Direcciones>, DirE: Array<Direcciones>, Cnts: Array<Contacto>) {

    if (frm.invalid) {
      Swal.fire({
        title: 'Error al actualizar el socio de negocios',
        icon: 'error',
        text: 'Los datos del formulario no son validos'
      });
      return;
    }

    this.proceso = true;
    this.BusnessP.Header = header;
    this.BusnessP.TabContacto = [];
    this.BusnessP.TabDireccion = [];
    // tslint:disable-next-line: forin
    for (const key in DirF) {
       this.BusnessP.TabDireccion.push(DirF[key]);
    }
    // tslint:disable-next-line: forin
    for (const key in DirE) {
      this.BusnessP.TabDireccion.push(DirE[key]);
    }
    // tslint:disable-next-line: forin
    for (const key  in Cnts) {
      this.BusnessP.TabContacto.push(Cnts[key]);
    }

    this.mkService.updateBP(this.auth.getToken(), this.BusnessP, this.auth.getDataToken().Code).subscribe(response => {

      Swal.fire({
        title: 'Socio Actualizado',
        icon: 'success',
        text: String(response)
      });
      this.proceso = false;
      this.valueDefault();
      frm.resetForm();
      this.childList.refreshListBP();
    }, (err) => {
      Swal.fire({
        title: 'Error al crear socio',
        icon: 'error',
        text: err.error
      });
      this.proceso = false;
    });
  }

  CrearSocio(frm: NgForm, header: SocioNegocios, DirF: Array<Direcciones>, DirE: Array<Direcciones>, Cnts: Array<Contacto>) {

    if (frm.invalid) {
      Swal.fire({
        title: 'Error al crear socio de negocios',
        icon: 'error',
        text: 'Los datos del formulario no son validos'
      });
      return;
    }

    this.proceso = true;
    this.BusnessP.Header = header;
    this.BusnessP.TabContacto = [];
    this.BusnessP.TabDireccion = [];
    // tslint:disable-next-line: forin
    for (const key in DirF) {
       this.BusnessP.TabDireccion.push(DirF[key]);
    }
    // tslint:disable-next-line: forin
    for (const key in DirE) {
      this.BusnessP.TabDireccion.push(DirE[key]);
    }
    // tslint:disable-next-line: forin
    for (const key in Cnts) {
      this.BusnessP.TabContacto.push(Cnts[key]);
    }

    this.mkService.createBP(this.auth.getToken(), this.BusnessP, this.auth.getDataToken().Code).subscribe(response => {
      console.log('Creacion', response);
      Swal.fire({
        title: 'Socio Creado',
        icon: 'success',
        text: String(response)
      });
      this.proceso = false;
      this.valueDefault();
      frm.resetForm();
      this.childList.refreshListBP();
    }, (err) => {
      console.log('Creacion err', err);
      Swal.fire({
        title: 'Error al crear socio',
        icon: 'error',
        text: err.error.ExceptionMessage ? err.error.ExceptionMessage : err.error
      });
      this.proceso = false;
    });
  }

  private valueDefault() {
    this.BusnessP = new BP();
    this.Partner = new SocioNegocios();
    this.DireccionesFac = new Array<Direcciones>();
    this.DireccionesEnt = new Array<Direcciones>();
    this.Direccion = new Direcciones();
    this.PrsContacto = new Array<Contacto>();
    this.Contacto = new Contacto();
    this.EstadoForm = 'N';
    this.EstadoDir = 'N';
    this.EstadoCnt = 'N';
    /* this.States = [];
    this.Countrys = []; */
  }
  showSuccess(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-success text-light', delay: 7000 });
  }

  showDanger(mensaje: string) {
    this.toastService.show(mensaje, { classname: 'bg-danger text-light', delay: 7000 });
  }
}
