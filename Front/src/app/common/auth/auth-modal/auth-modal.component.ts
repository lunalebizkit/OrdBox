import { Component, OnInit, Input, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';

import { BaseComponent } from '../../components/base/base.component';
import { AuthService } from '../interceptors/auth.service';

import { NzModalRef } from 'ng-zorro-antd/modal';
import { SecurityAuthService } from 'src/app/pages/auth/security-auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
})
export class AuthModalComponent extends BaseComponent implements OnInit {
  modal!: NzModalRef;
  form!: FormGroup;
  isLoading = false;

  get recaptchaControl(): AbstractControl {
    return this.form.controls['recaptcha'];
  }

  constructor(
    notificacionService: NzNotificationService,
    el: ElementRef,
    message: NzMessageService,
    private fb: FormBuilder,
    private securityAuthService: SecurityAuthService,
    private authService: AuthService
  ) {
    super(notificacionService, el, message);
  }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.form = this.fb.group(
      {
        userName: ['', [Validators.required]],
        password: ['', [Validators.required]],
      },
      { updateOn: 'submit' }
    );
  }

  submit() {
    if (!this.isValidForm(this.form)) return;

    this.isLoading = true;
    const model = this.form.getRawValue();

    this.securityAuthService
      .login(model)
      .toPromise()
      .then((r) => {
        this.authService.tokenLS = r.data.access_token;
        this.securityAuthService.getUser().subscribe((r) => {
          this.authService.currentUser = r.data;
          this.modal.triggerOk();
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
