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
    NzImageModule
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
 
  ],
  declarations: [
     HeaderOperationsButtonsComponent, 
     BaseComponent, 
     PopupConfirmationComponent,

  ],
  entryComponents: [
     HeaderOperationsButtonsComponent, 
     BaseComponent,
      PopupConfirmationComponent],
  providers: [
    
  ]
})
export class AppCommonModule { }
