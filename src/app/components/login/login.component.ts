import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/authentication/auth.service';

import Swal from 'sweetalert2';

import { UserLogin } from '../../models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UserLogin;
  processLogin: boolean;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.usuario = new UserLogin();
    this.processLogin = false;
  }

  ngOnInit() {
  }
  
  login(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.processLogin = true;
      this.auth.signIn(this.usuario).subscribe(response => {
          this.router.navigateByUrl('/home');
      }, (err) => {
        Swal.fire({
          title: 'Mensaje de sistema',
          icon: 'error',
          text: err.error
        });
        this.processLogin = false;
      });

      /* .subscribe(response => {
        this.router.navigateByUrl('/home');
      }, (error) => {
        console.log(error);
        Swal.fire({
          title: 'Mensaje de sistema',
          icon: 'error',
          text: error.error.error.message
        });
        this.processLogin = false;
      }); */
    }
  }
}
