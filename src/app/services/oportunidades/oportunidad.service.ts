import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OportunidadService {
  endpoint: string = environment.urlApi;

  constructor(
    private http: HttpClient
  ) {
  }

  getOptionsHdOpp(token: string, type: number, cardCode: string): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/CRM/GetOptions?type=${type}&cardcode=${cardCode}`;

    return this.http.get(api, { headers: headerApi }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getListSocios(token: string): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/CRM/GetListaPartner`;

    return this.http.get(api, { headers: headerApi }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }
}
