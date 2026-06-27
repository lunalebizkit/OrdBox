import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersListComponent } from './users-list/users-list.component';
import { UserRoutingModule } from './users-routing.module';
import { UsersEditDrawerComponent } from './users-edit-drawer/users-edit.drawer.component';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { AppCommonModule } from 'src/app/common/app.common.module';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzImageModule } from 'ng-zorro-antd/image';

@NgModule({  
  imports: [
    CommonModule,
    UserRoutingModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzGridModule,
    NzInputNumberModule,
    NzInputModule,
    NzSelectModule,
    AppCommonModule,
    NzTableModule,
    NzSwitchModule,
    NzPaginationModule,
    NzInputNumberModule,
    NzCollapseModule,
    NzUploadModule,
    NzSpaceModule,
    NzImageModule  
  ],declarations: [
    UsersListComponent,
    UsersEditDrawerComponent
  ]
})
export class UsuariosModule { }
