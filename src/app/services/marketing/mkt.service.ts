import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { DocSAP } from '../../models/marketing';

@Injectable({
  providedIn: 'root'
})
export class MktService {
  endpoint: string = environment.urlApi;
  constructor(
    private http: HttpClient
  ) { }

  createDocument(document: DocSAP, typeDocument: number, token: string, usuario: string) {
    const headersMk = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Marketing/CreateDocument?typeDocument=${typeDocument}&usuario=${usuario}`;

    return this.http.post(
      api,
      document,
      { headers: headersMk }
    ).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  saveDocument(document: DocSAP, typeDocument: number, token: string) {
    const headersMk = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Marketing/SaveDocument?typeEvent=I&typeDocument=${typeDocument}`;
    return this.http.post(
      api,
      document,
      {headers: headersMk}
    ).pipe(
      map((response: Response) => {
        return response;
      })
    );
  }

  getDocument(token: string, typeDocument: number, docEntry: number) {
    const headersDoc = new HttpHeaders()
    .set('Authorization', token);
    const api = `${this.endpoint}salesCVM/Marketing/GetDocument?typeDocument=${typeDocument}&DocEntry=${docEntry}`;

    return this.http.get(api, { headers: headersDoc }).pipe(
      map( (response: Response) => {
          return response;
      })
    );
  }

  getDocumentSAP(token: string, docEntry: number, cardcode: string, usuario: string) {
    const headersDocSAP = new HttpHeaders()
    .set('Authorization', token);
    let api = '';
    if (docEntry > 0) {
      api = `${this.endpoint}salesCVM/Marketing/GetDocumentSAP?docEntry=${docEntry}`;
    } else {
      api = `${this.endpoint}salesCVM/Marketing/GetDocumentSAP?docEntry=${docEntry}&cardcode=${cardcode}&usuario=${usuario}`;
    }

    return this.http.get(api, {headers: headersDocSAP }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateDocument() {

  }

  deleteDocument() {

  }
}
