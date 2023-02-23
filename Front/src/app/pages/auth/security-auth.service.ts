import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/common/services/api.base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SecurityAuthService {
  constructor(private api: ApiService) {}

  public login(user: any): Observable<any> {
    return this.api.post(`access/auth`, user, false);
  }
  public requestPasswordReset(passwordReset: any): Observable<any> {
    return this.api.post(`access/requestpasswordreset`, passwordReset, false);
  }

  public resetPassword(passwordReset: any): Observable<any> {
    return this.api.post(`access/resetpassword`, passwordReset, false);
  }

  public getUser(): Observable<any> {
    return this.api.get(`access/userAccount`);
  }
 
}
