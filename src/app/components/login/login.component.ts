import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/authentication/auth.service';

import Swal from 'sweetalert2';

import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario;
  processLogin: boolean;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.usuario = new Usuario();
    this.processLogin = false;
  }

  ngOnInit() {
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.processLogin = true;
      this.auth.login(this.usuario).subscribe(response => {
        this.router.navigateByUrl('/home');
      }, (error) => {
        console.log(error);
        Swal.fire({
          title: 'Mensaje de sistema',
          icon: 'error',
          text: error.error.error.message
        });
        this.processLogin = false;
      });
    }
  }
}
