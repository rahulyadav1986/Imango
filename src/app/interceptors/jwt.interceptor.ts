import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
  import { map, catchError } from 'rxjs/operators';
  import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
  
  @Injectable()
  export class JwtInterceptor implements HttpInterceptor {
    
    constructor(private authService: AuthenticationService) { }
  
  
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
      const token = this.authService.token;
  
      //Authentication by setting header with token value
      if (token) {
        request = request.clone({
          setHeaders: {
            'Authorization': token
          }
        });
      }
  
      if (!request.headers.has('Content-Type')) {
        request = request.clone({
          setHeaders: {
            'content-type': 'application/json'
          }
        });
      }
  
      request = request.clone({
        headers: request.headers.set('Accept', 'application/json')
      });
  
      return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            console.log('event--->>>', event);
          }
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          return throwError(error);
        }));
    }
  
  
  }