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
import { ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { SecurityAuthService } from './security-auth.service';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AppCommonModule } from 'src/app/common/app.common.module';
import { PermissionRolDrawerComponent } from './permission-rol/permission-rol.drawer.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
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
    NzDividerModule,
    AppCommonModule,
    NzDrawerModule,
    NzTabsModule,
    NzTransferModule
  ],

  declarations: [LoginComponent, PermissionRolDrawerComponent],
  providers: [
    SecurityAuthService
  ]
})
export class SecurityAuthModule { }
