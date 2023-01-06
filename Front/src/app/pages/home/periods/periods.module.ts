import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AppCommonModule } from 'src/app/common/app.common.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { PeriodsListComponent } from './periods-list/periods-list.component';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { PeriodsRoutingModule } from './periods-routing.module';
import { periodsDrawerComponent } from './new-periods-drawer/new-periods.drawer.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@NgModule({
  imports: [ CommonModule,
    PeriodsRoutingModule,
    NzTableModule,
    NzTagModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzIconModule,
    NzCollapseModule,
    NzButtonModule, 
    NzInputModule,
    FormsModule,
    NzSpinModule,
    AppCommonModule,
    NzSpaceModule,
    NzDividerModule,
    InfiniteScrollModule,
    NzToolTipModule,
    NzDatePickerModule
  ],
  declarations: [
    PeriodsListComponent, periodsDrawerComponent

  ]
})
export class PeriodsModule { }