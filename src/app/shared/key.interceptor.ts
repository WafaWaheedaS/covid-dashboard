import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
import { rapidApiHost, rapidApiKey } from '../app.constants';
  
  @Injectable({
    providedIn: 'root',
  })
  export class KeyInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let headers = request.headers.append('Content-Type', 'application/json');
      headers = request.headers.append('X-RapidAPI-Host', rapidApiHost)
      if (rapidApiKey) {
        headers = request.headers.append('X-RapidAPI-Key', `Bearer ${rapidApiKey}`);
      }
      const apiRequest = request.clone({ headers });
      return next.handle(apiRequest);
    }
  }
  