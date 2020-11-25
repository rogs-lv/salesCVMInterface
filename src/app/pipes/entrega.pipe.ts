import { Pipe, PipeTransform } from '@angular/core';
import { Direcciones } from '../models/socioNegocios';

@Pipe({
  name: 'typeDoc'
})
export class EntregaPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 23:
        return 'Cotización';
      case 17:
        return 'Pedido';
      case 15:
        return 'Entrega';
      case 13:
        return 'Factura de Venta';
      case 540000006:
        return 'Oferta de compra';
      case 22:
        return 'Orde de compra';
      case 20:
        return 'Entrada de mercancia';
      case 18:
        return 'Factura Proveedores';
      default:
        return '';
    }
  }
}
