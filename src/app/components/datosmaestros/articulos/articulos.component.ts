import { Component, OnInit, ViewChild } from '@angular/core';
import { Form, NgForm } from '@angular/forms';

import { Articulo, DocArticulo, GrupoArticulos, PriceList, Propiedad, UoM } from 'src/app/models/articulo';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { MtrDataService } from 'src/app/services/masterData/mtr-data.service';
import Swal from 'sweetalert2';
import { ListaarticulosComponent } from '../shared/listaarticulos/listaarticulos.component';

@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css']
})
export class ArticulosComponent implements OnInit {
  @ViewChild(ListaarticulosComponent, {static: false}) childList: ListaarticulosComponent;
  header: Articulo;
  tabProp: Array<Propiedad>;

  opcionesGrp: Array<GrupoArticulos>;
  opcionesUoM: Array<UoM>;
  opcionesList: Array<PriceList>;

  estadoFrm = 'N';
  proceso = false;

  constructor(
    private auth: AuthService,
    private mdService: MtrDataService
  ) {
    // this.document = new DocArticulo();
    this.header = new Articulo();
    this.tabProp = new Array<Propiedad>();
    this.opcionesGrp = new Array<GrupoArticulos>();
    this.opcionesUoM = new Array<UoM>();
    this.opcionesList = new Array<PriceList>();
  }

  ngOnInit() {
    this.getOpciones();
    this.getPrecios(1, '', 0);
    this.tabProp = this.buildProp([]);
  }

  lisenArticulo(value: any) {
    this.estadoFrm = 'E';
    this.header = value;
    this.tabProp = new Array<Propiedad>();
    this.createProps(value);
  }

  createProps(value: Articulo) {
    this.mdService.getDTItems(this.auth.getToken(), 2, value.ItemCode).subscribe(response => {
      this.tabProp = this.buildProp(response);
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'No se cargaron opciones para los artículos' : err.error
      });
    });
  }

  buildProp(propSap: Array<Propiedad>) {
    const newArray = [];
    for (let index = 0; index < 64; index++) {
      const j = propSap.findIndex(x => x.ItmsTypCod === (index + 1));
      if (j !== -1) {
        newArray.push({ ItmsTypCod: (index + 1), ItmsGrpNam: propSap[j].ItmsGrpNam, Status: true  });
      } else {
        newArray.push({ ItmsTypCod: (index + 1), ItmsGrpNam: `Artículos propiedad ${(index + 1)}`, Status: false  });
      }
    }
    return newArray;
  }

  getPrecios(type: number, itemcode: string, listnum: number) {
    this.mdService.getPrecio(this.auth.getToken(), type, listnum, itemcode).subscribe(response => {
        if (type === 1) {
          this.opcionesList = response;
        } else {
          this.header.Price = response[0].Price;
        }
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'No se recuperaron precios' : err.error
      });
    });
  }

  getOpciones() {
    this.mdService.getOpciones(this.auth.getToken(), 1).subscribe(response => {
        this.opcionesGrp = response.Grupo;
        this.opcionesUoM = response.Unidad;
    }, (err) => {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: err.status === 0 ? 'No se cargaron opciones para los artículos' : err.error
      });
    });
  }

  CancelarEdicionArticulo(frmArt: NgForm) {
    this.estadoFrm = 'N';
    this.header = new Articulo();
    this.tabProp = this.buildProp([]);
    frmArt.resetForm();
  }

  ActualizarArticulo(frmArt: NgForm, header: Articulo, props: Array<Propiedad>) {
    if (frmArt.invalid) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'El artículo que esta tratando de actualizar, no es valido'
      });
      return;
    }
    this.proceso = true;
    const values: any =  { ItemCode : header.ItemCode, ItemName : header.ItemName, ItmsGrpCod: header.ItmsGrpCod, UgpEntry: header.UgpEntry, ListNum: header.ListNum, Price: header.Price, InvntItem: header.InvntItem, SellItem: header.SellItem, PrchseItem: header.PrchseItem, WTLiable: header.WTLiable, VATLiable: header.VATLiable, validFor: header.validFor, CodeBars: header.CodeBars}
    this.mdService.updateItem(this.auth.getToken(), header, props, '').subscribe(response => {
      Swal.fire({
        title: 'Artículo Actualizado',
        icon: 'success',
        text: String(response)
      });
      this.proceso = false;
      this.valueDefault();
      frmArt.resetForm();
      this.childList.refreshListItems();
    }, (err) => {
      Swal.fire({
        title: 'Error al actualizar el artículo',
        icon: 'error',
        text: err.error.ExceptionMessage ? err.error.ExceptionMessage : err.error
      });
      this.proceso = false;
    });
  }

  CrearArticulo(frmArt: NgForm, header: Articulo, props: Array<Propiedad>) {
    if (frmArt.invalid) {
      Swal.fire({
        title: 'Error',
        icon: 'error',
        text: 'El artículo que esta tratando de crear, no es valido'
      });
      return;
    }
    this.proceso = true;
    const values: any =  { ItemCode : header.ItemCode, ItemName : header.ItemName, ItmsGrpCod: header.ItmsGrpCod, UgpEntry: header.UgpEntry, ListNum: header.ListNum, Price: header.Price, InvntItem: header.InvntItem, SellItem: header.SellItem, PrchseItem: header.PrchseItem, WTLiable: header.WTLiable, VATLiable: header.VATLiable, validFor: header.validFor, CodeBars: header.CodeBars}
    this.mdService.createItem(this.auth.getToken(), header, props, '').subscribe(response => {
      Swal.fire({
        title: 'Artículo Creado',
        icon: 'success',
        text: String(response)
      });
      this.proceso = false;
      this.valueDefault();
      frmArt.resetForm();
      this.childList.refreshListItems();
    }, (err) => {
      Swal.fire({
        title: 'Error al crear artículo',
        icon: 'error',
        text: err.error.ExceptionMessage ? err.error.ExceptionMessage : err.error
      });
      this.proceso = false;
    });
  }

  valueDefault() {
    this.estadoFrm = 'N';
    this.tabProp = new Array<Propiedad>();
    this.tabProp = this.buildProp([]);
  }
}
