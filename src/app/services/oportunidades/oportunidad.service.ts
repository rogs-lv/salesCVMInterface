import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OpportunitySAP } from '../../models/oportunidad';

@Injectable({
  providedIn: 'root'
})
export class OportunidadService {
  endpoint: string = environment.urlApi;

  constructor(
    private http: HttpClient
  ) {
  }

  getOptionsHdOpp(token: string, type: number, cardCode: string, idOpp: number): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/CRM/GetOptions?type=${type}&cardcode=${cardCode}&idOpp=${idOpp}`;

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

  getListSelects(token: string, accion: string, type: number) {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/CRM/GetSelects?accion=${accion}&type=${type}`;

    return this.http.get(api, { headers: headerApi }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getListOpps(token: string): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/CRM/GetListaOpps`;

    return this.http.get(api, { headers: headerApi }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getDataTabsOpp(token: string, type: number, id: number): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/CRM/GetTabsDocumentOpp?type=${type}&docnum=${id}`;

    return this.http.get(api, { headers: headerApi }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  createOpp(token: string, document: OpportunitySAP, usuario: string) {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/CRM/CreateOpportunity?usuario=${usuario}`;

    return this.http.post(
      api,
      document,
      { headers: headerApi }
    ).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  updateOpp(token: string, document: OpportunitySAP, usuario: string) {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/CRM/UpdateOpportunity?usuario=${usuario}`;

    return this.http.patch(
      api,
      document,
      { headers: headerApi }
    ).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }
}
