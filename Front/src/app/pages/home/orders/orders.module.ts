import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { AppCommonModule } from 'src/app/common/app.common.module';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { OrdersEditDrawerComponent } from './orders-edit-drawer/orders-edit.drawer.component';

@NgModule({
  imports: [
    OrdersRoutingModule,
    NzLayoutModule,
    NzSelectModule,
    CommonModule,
    AppCommonModule,
    NzCollapseModule,
    NzPageHeaderModule,
    NzFormModule,
    NzInputNumberModule,
    NzInputModule,
    NzIconModule,
    AgGridModule,
    NzTableModule,
    NzGridModule,
    NzDividerModule,
    NzSwitchModule,
    NzDatePickerModule,
    NzSpaceModule,
  ],
  declarations: [
    OrdersListComponent,
    OrdersEditDrawerComponent,
    
  ],
})
export class OrdersModule {}
