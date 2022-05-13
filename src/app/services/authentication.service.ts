import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Storage } from '@capacitor/storage';
const TOKEN_KEY = 'my-token';
const USER_KEY = 'my-user';
const ERROR_KEY = 'my-error';

import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from, ObservableInput } from 'rxjs';
import { Urls } from 'src/app/model/Constant';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  onError: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  token = '';
  readonly POST_URL = `${Urls.BaseApi}account/loginExternal`
  
  constructor(private http: HttpClient) { 
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });    
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: {email, password}): Observable<any> {
    console.log('here 2')
    return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Storage.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  getCurrentUser(): Observable<any> {
    return from(Storage.get({key: USER_KEY}));
  }

  // loginWithExternalProvider(user: any): Observable<any> {
  //   const params = new HttpParams().set('req', JSON.stringify(user));
  //   return this.http.post(this.POST_URL, null, {
  //     headers: new HttpHeaders()
  //       .set('accept', 'application/json'),
  //     params: params,
  //     responseType: 'json'
  //   }).pipe(
  //     map((data: any) => data),
  //     switchMap(data => {
  //       Storage.set({key: USER_KEY, value: JSON.stringify(data.data.user)});
  //       return from(Storage.set({key: TOKEN_KEY, value: data.data.token}));
  //     }),
  //     tap(_ => {
  //       this.isAuthenticated.next(true);
  //     })
  //   );
  // }

  loginWithExternalProvider(user: any) {
    const params = new HttpParams().set('req', JSON.stringify(user));
    this.http.post(this.POST_URL, null, {
      headers: new HttpHeaders()
        .set('accept', 'application/json'),
      params: params,
      responseType: 'json'
    }).subscribe((res: any) => {
      if(res.success) {
        this.isAuthenticated.next(true);
        Storage.set({key: USER_KEY, value: JSON.stringify(res.data.user)});
        Storage.set({key: TOKEN_KEY, value: res.data.token});
      } else {
        this.onError.next(JSON.stringify(res));
        this.isAuthenticated.next(false);
      }
    }, (error: any) => {
      this.onError.next(JSON.stringify(error));
    });
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    Storage.remove({key: TOKEN_KEY});
    return Storage.remove({key: USER_KEY});
  }
}
