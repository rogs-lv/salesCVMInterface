import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashService {
  endpoint: string = environment.urlApi;
  constructor(
    private http: HttpClient
  ) { }

  getPromociones(token: string, usuario: string) {
    const headersD = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Dashboard/GetPromocion?usuario=${usuario}`;

    return this.http.get(
      api,
      { headers: headersD }
    ).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }
  getNoticias(token: string, usuario: string) {
    const headersD = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Dashboard/GetNoticia?usuario=${usuario}`;

    return this.http.get(
      api,
      { headers: headersD }
    ).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }
  getDtsGrafica(token: string, usuario: string) {
    const headersD = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Dashboard/GetGrafica?usuario=${usuario}`;

    return this.http.get(
      api,
      { headers: headersD }
    ).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  getCoti(token: string, usuario: string) {
    const headersD = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Dashboard/GetCotizaciones?usuario=${usuario}`;

    return this.http.get(
      api,
      { headers: headersD }
    ).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }
}
