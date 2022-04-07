import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('tokenMNQ');
    if(token){
      console.log('interceptin');
      
      const headers: HttpHeaders = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const authReq = request.clone({ headers });
      return next.handle(authReq);
    }
    return next.handle(request)
  }
}
