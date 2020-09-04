import { Injectable } from '@angular/core';
import { UserLogin, User } from '../../models/usuario';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  endpoint: string = environment.urlApi;
  /* headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*'); */
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
  }

  // Sign-up
  /* signUp(user: User): Observable<any> {
    let api = `${this.endpoint}/register-user`;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      )
  } */

  // Sign-in
  signIn(user: UserLogin) {
    const headersLogin = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams()
    .set('IdUser', user.IdUser)
    .set('Password', user.Password);

    return this.http.post(
      `${this.endpoint}salesCMV/Acceso/authenticate`,
      body, { headers: headersLogin }
    ).pipe(
      map( (response: Response) => {
        localStorage.setItem('access_token', response['Token']);
        return response;
      })
    );
    /* console.log(user);
    return this.http.post<User>(`http://192.168.1.70/ServiceSalesCVM/salesCMV/Acceso/authenticate`, user, { headers: this.headers })
      .subscribe((res: any) => {
        console.log('antes token', res);
        localStorage.setItem('access_token', res.Token);
        console.log('desoues token', res);
        this.getUserProfile(res.Code).subscribe((result) => {
          this.currentUser = result;
          this.router.navigate(['user-profile/' + result.msg._id]);
        });
      }); */
  }



  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    const removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigateByUrl('/login');
    }
  }

  // User profile
  getUserProfile(id): Observable<any> {
    const headersProf = new HttpHeaders()
    /* .set('Content-Type', 'application/json') */
    .set('Authorization', this.getToken());
    const api = `${this.endpoint}Config/GetConfiguration?code=${id}`;
    return this.http.get(api, { headers: headersProf }).pipe(
      map( (response: Response) => {
          return response;
      })
    );
    /* return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    ); */
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}