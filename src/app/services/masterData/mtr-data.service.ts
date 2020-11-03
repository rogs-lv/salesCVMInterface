import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { BP } from 'src/app/models/socioNegocios';
import { Articulo, Propiedad } from 'src/app/models/articulo';
import { DocArticulo } from '../../models/articulo';

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

  getDTItems(token: string, type: number, itemcode: string) {
    const headersItem = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/GetItems?type=${type}&itemcode=${itemcode}`;

    return this.http.get(api, { headers: headersItem }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getPrecio(token: string, type: number, listnum: number, itemcode: string) {
    const headersItem = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/GetPrecios?type=${type}&itemcode=${itemcode}&listnum=${listnum}`;

    return this.http.get(api, { headers: headersItem }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getOpciones(token: string, type: number) {
    const headersItem = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/GetOpciones?type=${type}`;

    return this.http.get(api, { headers: headersItem }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  createItem(token: string, head: any, tabsProp: Array<Propiedad>, usuario: string) {
    const headersMk = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/CreateItems?usuario=${usuario}`;

    return this.http.post(
      api,
      { Header: head, TabsProps: tabsProp },
      { headers: headersMk }
    ).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  updateItem(token: string, head: any, tabsProp: Array<Propiedad>, usuario: string) {
    const headersMk = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/UpdateItem?usuario=${usuario}`;

    return this.http.patch(
      api,
      { Header: head, TabsProps: tabsProp },
      { headers: headersMk }
    ).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  getSalesEmployee(token: string) {
    const header = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/GetEmpleadosVentas?type=1`;

    return this.http.get(api, { headers: header }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getNumeracion(token: string, type: string, subtype: string) {
    const header = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/GetDocumentNumbering?type=${type}&subtype=${subtype}`;

    return this.http.get(api, { headers: header }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }

  getExiste(token: string, type: string, value: string) {
    const header = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/MasterData/GetExiste?type=${type}&value=${value}`;

    return this.http.get(api, { headers: header }).pipe(
      map( (response: any) => {
          return response;
      })
    );
  }
}
