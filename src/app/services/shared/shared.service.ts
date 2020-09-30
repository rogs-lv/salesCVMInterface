import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../../models/masterData';
import { SocioNegocios } from '../../models/socioNegocios';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private item = new BehaviorSubject<Item>(null);
  sharedMessage = this.item.asObservable();

  private socio = new BehaviorSubject<SocioNegocios>(null);
  sharedSocioBP = this.socio.asObservable();

  constructor() { }

  nextMessage(message: Item) {
    this.item.next(message);
  }

  nextSocioBP(bp: SocioNegocios) {
    this.socio.next(bp);
  }
}
