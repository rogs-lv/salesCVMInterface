import { Pipe, PipeTransform } from '@angular/core';
import { Direcciones } from '../models/socioNegocios';

@Pipe({
  name: 'amenaza'
})
export class FacturacionPipe implements PipeTransform {

  transform(values: string): string {
    switch (values) {
      case '1':
        return 'Bajo';
      case '2':
        return 'Medio';
      case '3':
        return 'Alto';
      default:
        return '';
    }
  }

}
