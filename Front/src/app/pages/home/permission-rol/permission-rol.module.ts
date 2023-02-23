import { NgModule } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AppCommonModule } from 'src/app/common/app.common.module';
import { PermissionRolComponent } from './permission/permission-rol.component';
import { PermissionRolRoutingModule } from './permission-rol.routing.module';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    PermissionRolRoutingModule,
    CommonModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    IconsProviderModule,
    NzAvatarModule, 
    NzLayoutModule,
    NzMenuModule,
    NzCardModule,
    NzDividerModule,
    AppCommonModule,
    NzTabsModule,
    NzTransferModule
  ],
  declarations: [
    PermissionRolComponent
  ],
})
export class PermissionModule {}