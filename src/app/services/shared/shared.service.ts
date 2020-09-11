import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../../models/masterData';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private item = new BehaviorSubject<Item>(null);
  sharedMessage = this.item.asObservable();

  constructor() { }

  nextMessage(message: Item) {
    this.item.next(message);
  }
}
