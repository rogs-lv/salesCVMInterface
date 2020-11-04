import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../services/authentication/auth.service';
import { MenuOpciones, Adicional } from '../../models/menu';

import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  menu: MenuOpciones;
  adicional: Adicional;
  nombreUsr: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.menu = new MenuOpciones();
    this.adicional = new Adicional();
    this.loadConfiMenu();
    this.nombreUsr = this.getNombreUsuario();
  }

  ngOnInit() {
  }

  logout() {
    this.auth.doLogout();
    this.router.navigateByUrl('/login');
  }

  loadConfiMenu() {
    let jwt = jwt_decode(this.auth.getToken());
    this.auth.getUserProfile(jwt.Code).subscribe( response => {
      this.menu = response.menuOpciones;
      this.adicional = response.confOpciones;
    }, (err) => {
      console.log(err);
      Swal.fire({
        title: 'Error al obtener las configuraciones del usuario',
        icon: 'error',
        text: err.error.Message
      });
    });
  }

  getNombreUsuario() {
    let jwt = jwt_decode(this.auth.getToken());
    return jwt.Name;
  }
}
