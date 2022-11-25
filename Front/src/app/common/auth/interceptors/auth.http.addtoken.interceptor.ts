import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpAuthAddTokenInterceptor implements HttpInterceptor {
  /**
   * @param {AuthService} authService Servicio para el manejo de la autenticacion
   */
  constructor(private authService: AuthService) { }

  /**
   * @description Añade authorization a request
   * @param  {HttpRequest<any>} req
   * @param  {HttpHandler} next
   * @returns Observable
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = this.addTokenToRequest(req);
    return next.handle(req.clone({ headers: headers }));
  }

  addTokenToRequest(req: HttpRequest<any>): HttpHeaders{
    let headers = req.headers || new HttpHeaders();
    const token = this.authService.tokenLS;
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
}