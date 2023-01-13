import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { AppCommonModule } from "src/app/common/app.common.module";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzImageModule } from "ng-zorro-antd/image";
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AgGridModule } from 'ag-grid-angular';
import { NzIconModule } from "ng-zorro-antd/icon";
import { debitMemoComponent } from "./debit-memo/debit-memo.component";
import { NotesRoutingModule } from "./notes-routing.module";
import { CreditMemoComponent } from "./credit-memo/credit-memo.component";
import { creditMemoListComponent } from "./creditMemo-list/creditMemo-list.component";
import { debitMemoListComponent } from "./debitMemo-list/debitMemo-list.component";
import { CreditMemoViewDrawerComponent } from "./creditMemo-view-drawer/creditMemo-view-drawer.component";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzToolTipModule } from "ng-zorro-antd/tooltip";
import { NzListModule } from "ng-zorro-antd/list";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzDescriptionsModule } from "ng-zorro-antd/descriptions";
import { DebitMemoViewDrawerComponent } from "./debitMemo-view-drawer/debitMemo-view-drawer.component";

@NgModule({
    imports: [CommonModule,
    NotesRoutingModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzGridModule,
    NzInputNumberModule,
    NzInputModule,
    NzSelectModule,
    AppCommonModule,
    NzIconModule,
    NzTableModule,
    NzSwitchModule,
    NzPaginationModule,
    NzDividerModule,
    NzCollapseModule,
    NzUploadModule,
    NzSpaceModule,
    NzImageModule,
    AgGridModule,
    NzButtonModule,
    NzToolTipModule,
    NzListModule,
    NzDatePickerModule,
    NzDescriptionsModule,  
    ],
    declarations:[ debitMemoComponent, 
                   CreditMemoComponent, 
                   creditMemoListComponent, 
                   debitMemoListComponent, 
                   CreditMemoViewDrawerComponent,
                   DebitMemoViewDrawerComponent]
})
export class NotesModule {}