import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { HttpAuthAddTokenInterceptor } from './auth.http.addtoken.interceptor';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpAuth401ErrorInterceptor implements HttpInterceptor {
  private modal!: NzModalRef;
  private current: number = 0;
  private requests!: Array<HttpRequest<any>>;

  constructor(
    private authService: AuthService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private injector: Injector
  ) {}

  /**
   * Interceptor que intercepta todos los httpErrorResponse de la aplicación
   * y muestra el mensaje correspondiente al usuario segun su status
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401) {
            if (!this.modal) {
              this.logout();
              this.showModal();
              this.requests = [];
            }
            this.addRequestToListRequests(req);
            return this.modal.afterClose.asObservable().pipe(
              switchMap(() => {
                return next.handle(this.requests[this.current++]);
              })
            );
        } else {
          return throwError(() => errorResponse);
        }
      })
    );
  }

  private logout() {
    try {
      this.authService.logout();
    } catch (e) {}
  }

  private showModal() {
    this.modal = this.modalService.create({
      nzContent: AuthModalComponent,
      nzOnOk: () => {
        this.afterSuccessfulLogin();
      },
      nzClosable: false,
      nzMaskClosable: false,
      nzFooter: null,
    });
    this.modal.componentInstance.modal = this.modal;
  }

  private addRequestToListRequests(req: HttpRequest<any>) {
    this.requests.push(req);
  }

  private afterSuccessfulLogin() {
    this.modifyRequestsWithNewToken();
    this.modal.close();
    // this.modal = null;
    this.current = 0;
  }

  private modifyRequestsWithNewToken() {
    const interceptor = this.injector.get(HttpAuthAddTokenInterceptor);
    this.requests = this.requests.map((req) => {
      const headers = interceptor.addTokenToRequest(req);
      const newReq = req.clone({ headers });
      return newReq;
    });
  }
}
