import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AppCommonModule } from 'src/app/common/app.common.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ReportComponent } from './report-z/report.component';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@NgModule({
  imports: [ CommonModule,
    ReportRoutingModule,
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
    ReportComponent
  ]
})
export class ReportModule { }