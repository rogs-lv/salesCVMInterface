import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BP } from 'src/app/models/socioNegocios';

@Injectable({
  providedIn: 'root'
})
export class MtrDataService {

  endpoint = environment.urlApi;
  constructor(
    private http: HttpClient
  ) {
  }

  getItems(token: string, type: number, whsCode: string, priceList: string) {
    const headersItem = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/GetMasterData?type=${type}&priceList=${priceList}&whsCode=${whsCode}`;

    return this.http.get(api, { headers: headersItem }).pipe(
      map( (response: Response) => {
          return response;
      })
    );
  }
  getBusnessPartner(token: string, type: number) {
    const headersBP = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/GetMasterData?type=${type}`;

    return this.http.get(api, { headers: headersBP }).pipe(
      map( (response: Response) => {
          return response;
      })
    );
  }

  getInformacionSocio(token: string, type: number, cardcode: string) {
    const headersBP = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/GetBusnessPartner?type=${type}&cardcode=${cardcode}`;

    return this.http.get(api, {headers: headersBP}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getListBP(token: string, type: number) {
    const headersBP = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/GetBusnessPartner?type=${type}&cardcode=''`;

    return this.http.get(api, { headers: headersBP }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getDestinos(token: string) {
    const headersDs = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/GetDestinos`;

    return this.http.get(api, { headers: headersDs }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  createBP(token: string, documento: BP, usuario: string) {
    const headersMk = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/CreateBusnessPartner?usuario=${usuario}`;

    return this.http.post(
      api,
      documento,
      { headers: headersMk }
    ).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  updateBP(token: string, documento: BP, usuario: string) {
    const headersMk = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/UpdateBusnessPartner?usuario=${usuario}`;

    return this.http.patch(
      api,
      documento,
      {headers: headersMk}
    ).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }
}
