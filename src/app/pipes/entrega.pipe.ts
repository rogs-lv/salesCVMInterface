import { Pipe, PipeTransform } from '@angular/core';
import { Direcciones } from '../models/socioNegocios';

@Pipe({
  name: 'entrega'
})
export class EntregaPipe implements PipeTransform {

  transform(values: Array<Direcciones>): Array<Direcciones> {
    const dirTipoE = [];
    for (const key in values) {
      if (values[key].AdresType === 'S') {
        dirTipoE.push(values[key]);
      }
    }
    return dirTipoE;
  }

}
