import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { SecurityAuthService } from '../security-auth.service';
import { RolesConst } from '../permission/permission-rol.enum';
import { AuthService } from 'src/app/common/auth/interceptors/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  /**
   * Formulario
   */
  form!: FormGroup;
  /**
   * Formulario
   */
  resetPasswordForm!: FormGroup;
  /**
 * Determina si se esta guardando
 */
   isSaving!: boolean;

  /**
   * Determina si se muestra el drawer para resetear contraseña
   */
   isResetPasswordVisible = false;

    /**
     * Constructor
     */
  constructor(
    private message: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private token: AuthService,
    private route: ActivatedRoute,
    private service: SecurityAuthService
   ){ }
//   /**
//    * Init event
//    */
ngOnInit() {
  this.form = this.fb.group({
    userName: [null, [Validators.required]],
    password: [null, [Validators.required]],
    
  });
}


getYear() {
  return new Date().getFullYear();
}

  /**
  * Evento de login
  */
  login(token?: string) {
    let model = this.getModel();
    this.isSaving = true;

    this.service.login(model).subscribe({
      next: (r)=>{
        this.isSaving = false;
        if (r.rol === new RolesConst().admin) {
          this.router.navigate(['/home'], { relativeTo: this.route})
          this.message.success('Bienvenido' + ' ' + r.userName)
        }
      } ,
      error: ()=> {
      this.isSaving= false;
      this.message.error('Usuario o Contraseña invalido!!!')
      } 
    })
  }
    /**
   * Obtiene el modelo
   */
    getModel() {
      return {
        userName: this.form.controls['userName'].value,
        password: this.form.controls['password'].value,
        recaptcha: ''
      }
    }
     /**
   * Evento del captcha
   */
   private singleExecutionSubscription!: Subscription;
     /**
   * Evento del onDestroy
   */
  public ngOnDestroy(): void {
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
  }
  /**
   * Evento del captcha para login
   */
   public executeImportantAction(): void {
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
    this.login();
  }
 }
