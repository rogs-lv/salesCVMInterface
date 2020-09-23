import { state } from '@angular/animations';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FilterStates'
})
export class EstadosPipe implements PipeTransform {

  transform(States: any, Code: string): Array<any> {
    if (Code !== undefined) {
      const newStates = [];
      for (const key in States) {
        if (States[key].Country === Code) {
          newStates.push(States[key]);
        }
      }
      return newStates;
    }
  }

}
