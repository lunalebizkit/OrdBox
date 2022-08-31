import { CommonServicesModule } from 'src/app/common/services/services.module';
import { environment } from './../../../environments/environment';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { LoginComponent } from './login/login.component';
import { SecurityAuthRoutingModule } from './security-auth.routing';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { SecurityAuthService } from './security-auth.service';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ReCaptchaV3Service, RECAPTCHA_LANGUAGE, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
// import { PermissionService } from './permission/permission-manager.service';
// import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

@NgModule({
  imports: [
    CommonServicesModule,
    CommonModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzDrawerModule,
    SecurityAuthRoutingModule,
    ReactiveFormsModule,
    IconsProviderModule,
    NzAvatarModule, 
    NzLayoutModule,
    NzMenuModule,
    NzCardModule,
    NzDividerModule
    
  ],
  declarations: [LoginComponent],
  providers: [
    SecurityAuthService,ReCaptchaV3Service
  ]
})
export class SecurityAuthModule { }
