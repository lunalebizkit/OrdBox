import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AppCommonModule } from 'src/app/common/app.common.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommonModule } from '@angular/common';
import { DeliveryNotesRoutingModule } from './deliveryNotes-routing.module';
import { DeliveryNotesListComponent } from './deliveryNotes-list/deliveryNotes-list.component';
import { NgModule } from '@angular/core';
import { DeliveryNotesEditComponent } from './deliveryNotes-edit/deliveryNotes-edit.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { DeliveryNotesViewDrawerComponent } from './deliveryNotes-view-drawer/deliveryNotes-view-drawer.component';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { DeliveryNotesPdfComponent } from './deliveryNotes-pdf/deliveryNotes-pdf.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
;


@NgModule({
    declarations: [
        DeliveryNotesListComponent, 
        DeliveryNotesEditComponent,
        DeliveryNotesViewDrawerComponent,
        DeliveryNotesPdfComponent
    ],
    imports: [
        AppCommonModule,
        CommonModule,
        DeliveryNotesRoutingModule,
        NzLayoutModule,
        NzPageHeaderModule,
        NzInputModule,
        NzTagModule,
        NzTableModule,
        NzButtonModule,
        NzIconModule,
        NzSpaceModule,
        NzDividerModule,
        FormsModule,
        NzSpinModule,
        AppCommonModule,
        NzCollapseModule,
        NzSwitchModule,
        NzInputNumberModule,
        NzDescriptionsModule,
        NzDatePickerModule,
        NzToolTipModule,
    ]
})
export class DeliveryNotesModule { }