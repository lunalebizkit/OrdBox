import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersListComponent } from './users-list/users-list.component';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UserRoutingModule } from './users-routing.module';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AppCommonModule } from 'src/app/common/app.common.module';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';



@NgModule({
  declarations: [
    UsersListComponent,
    UsersEditComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NzButtonModule,
    NzListModule,
    NzSwitchModule,
    AppCommonModule,
    NzToolTipModule,
    NzSpaceModule,
    NzGridModule,
    NzTableModule,
    NzIconModule,
    NzDividerModule,
    NzLayoutModule,
    NzCollapseModule
  ]
})
export class UsuariosModule { }
