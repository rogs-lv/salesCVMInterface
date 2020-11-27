import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ActivitySAP } from 'src/app/models/actividad';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  endpoint: string = environment.urlApi;

  constructor(
    private http: HttpClient
  ) { }

  getActividades(token: string): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Activity/GetListasActivity?type=3`;

    return this.http.get(api, { headers: headerApi }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getOpps(token: string, type: number, idDoc: number = 0): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Activity/GetListasActivity?type=${type}&idDoc=${idDoc}`;

    return this.http.get(api, { headers: headerApi }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getOptionsActivity(token: string, action: number): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Activity/GetOptionsActivity?action=${action}`;

    return this.http.get(api, { headers: headerApi }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getContacsActivity(token: string, cardCode: string): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Activity/GetContactsActivity?cardCode=${cardCode}`;

    return this.http.get(api, { headers: headerApi }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getActivityId(token: string, idDoc: number): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Activity/GetActivityId?idDoc=${idDoc}`;

    return this.http.get(api, { headers: headerApi }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  postActivity(token: string, usuario: string, document: ActivitySAP): Observable<any> {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Activity/CreateActivity?usuario=${usuario}`;

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

  patchActivity(token: string, usuario: string, document: ActivitySAP) {
    const headerApi = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Activity/UpdateActivity?usuario=${usuario}`;

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
