import { Pipe, PipeTransform } from '@angular/core';
import { Direcciones } from '../models/socioNegocios';

@Pipe({
  name: 'facturacion'
})
export class FacturacionPipe implements PipeTransform {

  transform(values: Array<Direcciones>): Array<Direcciones> {
    const dirTipoF = [];
    for (const key in values) {
      if (values[key].AdresType === 'B') {
        dirTipoF.push(values[key]);
      }
    }
    return dirTipoF;
  }

}
