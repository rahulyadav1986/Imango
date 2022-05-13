import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Response} from "../model/Response";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Urls} from "../model/Constant";
import {environment} from 'src/environments/environment';
import { OtpRequest } from '../Model/otp-request';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient: HttpClient) {
  }

  verifyGoogleUser(token: string): Observable<Response<any>> {
    let AuthRequest = {
      'Provider': 'google'
    }
    return this.httpClient.post<Response<any>>(`${Urls.BaseApi}account/auth`, AuthRequest, {
      headers: new HttpHeaders()
        .set('Authorization', token),
      responseType: 'json',
    });
  }

  generateOTP(otpRequest: OtpRequest) : Observable<Response<any>> {
    return this.httpClient.post<Response<any>>(`${Urls.BaseApi}account/verify`, otpRequest, {
      headers: new HttpHeaders()
        .set('Authorization', ''),
      responseType: 'json',
    });
  }
}
