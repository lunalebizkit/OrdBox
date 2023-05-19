import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AppCommonModule } from 'src/app/common/app.common.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzListModule } from 'ng-zorro-antd/list';
import { QuittanceListComponent } from './quittance-list/quittance-list.component';
import { QuittanceRoutingModule } from './quittance-routing.module';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { QuittanceEditComponent } from './quittance-edit/quittance-edit.component';
import { QuittanceViewDrawerComponent } from './quittance-view-drawer/quittance-view-drawer.component';
import { QuittancePdfComponent } from './quittance-pdf/quittance-pdf.component';



@NgModule({
  imports: [
    AppCommonModule,
    QuittanceRoutingModule,
    CommonModule,
    NzButtonModule,
    NzToolTipModule,
    NzListModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzGridModule,
    NzInputNumberModule,
    NzSelectModule,
    NzIconModule,
    NzTableModule,
    NzSwitchModule,
    NzPaginationModule,
    NzDividerModule,
    NzCollapseModule,
    NzSpaceModule,
    NzCollapseModule,
    NzDatePickerModule,
    NzDescriptionsModule,
    FormsModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzTagModule,
    NzSpinModule,
  ],
  declarations: [
    QuittanceListComponent,
    QuittanceEditComponent,
    QuittanceViewDrawerComponent,
    QuittancePdfComponent
 
  ],
})
export class QuittanceModule {}