import { Injectable, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { AuthUserModel } from "../models/auth-user.model";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  /* Modal para log in de usuario */
  @Output() activateAuthModal = new EventEmitter();

  /** Subject usado para obtener el usuario*/
   private userSubject!: BehaviorSubject<AuthUserModel>;

  /** Usuario de la aplicacion*/
   public user: Observable<AuthUserModel>;

  /**
   * Constructor
   */
  constructor() {

     this.userSubject = new BehaviorSubject<AuthUserModel>(JSON.parse(localStorage.getItem('auth-user')!));
     this.user = this.userSubject.asObservable();
  }


  public get currentUser(): AuthUserModel {
     return this.userSubject.value;
  }


  /**
   * Metodo para desloguear el usuario
   */
  logout() {
    localStorage.removeItem('auth-user');
     this.userSubject = new BehaviorSubject<AuthUserModel>(new AuthUserModel());
  }

  public set userLogin(value: any) {
    localStorage.setItem('auth-user', JSON.stringify(value));
    this.userSubject.next(JSON.parse(localStorage.getItem('auth-user')!))
    //  this.userSubject = new BehaviorSubject<AuthUserModel>();
  }

}
