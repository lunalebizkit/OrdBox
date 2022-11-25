import { Injectable, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { AuthUserModel } from "../models/auth-user.model";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  /* Modal para log in de usuario */
  // @Output() activateAuthModal = new EventEmitter();

  /** Usuario de la aplicacion*/
   public user: BehaviorSubject<AuthUserModel>;

  /**
   * Constructor
   */
  constructor() {
     this.user = new BehaviorSubject<AuthUserModel>(JSON.parse(localStorage.getItem('auth-user')!));
  }
  /* Medtodo para setear Token y Obtener */
  public set tokenLS(token: string) {
    localStorage.setItem('token', JSON.stringify(token));
  }
  public get tokenLS(): string {
    return JSON.parse(localStorage.getItem('token')!);
  }
  /* Metodo para setea usuario y obtener */
  public get currentUser(): AuthUserModel {
     return this.user.value;
  }
  public set currentUser(user: AuthUserModel) {
    localStorage.setItem('auth-user', JSON.stringify(user));
    this.user = new BehaviorSubject<AuthUserModel>(user);
  }

  /**
   * Metodo para desloguear el usuario
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('auth-user');
    //  this.user = new BehaviorSubject<AuthUserModel>(new AuthUserModel());
  }



}
