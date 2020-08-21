import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(form: NgForm){
    if (form.invalid) {
      console.log('Form invalido');
      return;
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}
