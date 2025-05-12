import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzImageModule } from 'ng-zorro-antd/image';

import { PopupConfirmationComponent } from './components/popup-confirmation/popup-confirmation.component';
import { HeaderOperationsButtonsComponent } from './components/headers/buttons.oparations.header.component';
import { BaseComponent } from './components/base/base.component';
import { AuthModule } from './auth/auth.module';
import { PermissionDirective } from './directives/permission.directive';
import { AuthModalComponent } from './auth/auth-modal/auth-modal.component';
import { CuitPipe } from './pipes/cuit.pipe';
import { NoCommaPipe } from './pipes/no-comma.pipe';
import { ButtonOperationFooter } from './components/footers/button.operation.footer.component';
import { InvoiceTypePipe } from './pipes/invoice-type.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    NzFormModule,
    NzIconModule,
    NzSelectModule,
    NzModalModule,
    NzSpinModule,
    NzMessageModule,
    NzButtonModule,
    NzPageHeaderModule,
    NzNotificationModule,
    NzTypographyModule,
    NzTagModule,
    NzImageModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    NzFormModule,
    NzIconModule,
    NzSelectModule,
    NzModalModule,
    NzSpinModule,
    NzMessageModule,
    NzButtonModule,
    NzPageHeaderModule,
    NzNotificationModule,
    HeaderOperationsButtonsComponent,
    NzTypographyModule,
    NzTagModule,
    PopupConfirmationComponent,
    AuthModule,
    PermissionDirective,
    CuitPipe,
    NoCommaPipe,
    ButtonOperationFooter,
    InvoiceTypePipe,
  ],
  declarations: [
    HeaderOperationsButtonsComponent,
    BaseComponent,
    PopupConfirmationComponent,
    PermissionDirective,
    AuthModalComponent,
    CuitPipe,
    NoCommaPipe,
    ButtonOperationFooter,
    InvoiceTypePipe
  ],
  entryComponents: [
    HeaderOperationsButtonsComponent,
    BaseComponent,
    PopupConfirmationComponent,
    ButtonOperationFooter,
  ],
  providers: [],
})
export class AppCommonModule {}
