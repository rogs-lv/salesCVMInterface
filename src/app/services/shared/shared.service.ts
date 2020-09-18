import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from '../../models/masterData';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private item = new BehaviorSubject<Item>(null);
  sharedMessage = this.item.asObservable();

  private listItem = new BehaviorSubject<any>(null);
  sharedList = this.listItem.asObservable();

  constructor() { }

  nextMessage(message: Item) {
    this.item.next(message);
  }

  nextList(list: Array<any>) {
    this.listItem.next(list);
  }
}
