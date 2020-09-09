import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MtrDataService } from 'src/app/services/masterData/mtr-data.service';
import { Item } from 'src/app/models/masterData';
import { AuthService } from 'src/app/services/authentication/auth.service';



@Component({
  selector: 'app-lista-articulos',
  templateUrl: './lista-articulos.component.html',
  styleUrls: ['./lista-articulos.component.css']
})
export class ListaArticulosComponent implements OnInit {

  listArt: Item;

  constructor(
    private mdService: MtrDataService,
    private auth: AuthService
  ) {
    this.listArt = new Item();
  }

  ngOnInit() {
    this.getListItems();
  }

  getListItems() {
    this.mdService.getItems(this.auth.getToken(), 4, '01', '3').subscribe(response => {
      console.log(response);
    }, (err) => {
      Swal.fire({
        title: 'Mensaje de sistema',
        icon: 'error',
        text: err.error
      });
    });
  }
}
