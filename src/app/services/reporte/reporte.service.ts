import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  endpoint: string = environment.urlApi;

  constructor(
    private http: HttpClient
  ) { }

  printReport(token: string, idDoc: number, type: number): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Impresion/PrintGenerate?idDoc=${idDoc}&type=${type}`;
    const options = { responseType: 'blob' };

    return this.http.get(api, { headers: headerApi, responseType: 'blob' }).pipe(
      map( (response: any) => {
          return new Blob([response], {type: 'application/pdf'});
      })
    );
  }
}
