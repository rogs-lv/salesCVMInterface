import { Component, OnInit } from '@angular/core';
import { SocioNegocios } from 'src/app/models/socioNegocios';

@Component({
  selector: 'app-sociosnegocios',
  templateUrl: './sociosnegocios.component.html',
  styleUrls: ['./sociosnegocios.component.css']
})
export class SociosnegociosComponent implements OnInit {

  Partner: SocioNegocios;
  Series: Array<string> = ['Manual'];
  CardTypes = [{ Code: 'C', Name: 'Cliente'}, { Code: 'S', Name : 'Vendedor'}, { Code: 'L', Name: 'Lead'}];
  Currencies = ['MXP', 'EUA'];

  constructor() {
    this.Partner = new SocioNegocios();
  }

  ngOnInit() {
  }

}
