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
import { creditMemoComponent } from "./credit-memo/credit-memo.component";
import { creditMemoListComponent } from "./creditMemo-list/creditMemo-list.component";
import { debitMemoListComponent } from "./debitMemo-list/debitMemo-list.component";

@NgModule({
    imports: [CommonModule,
    NotesRoutingModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzGridModule,
    NzInputNumberModule,
    NzInputModule,
    NzSelectModule,
    CommonModule,
    AppCommonModule,
    NzIconModule,
    NzTableModule,
    NzGridModule,
    NzSwitchModule,
    NzPaginationModule,
    NzDividerModule,
    NzInputNumberModule,
    NzCollapseModule,
    NzUploadModule,
    NzSpaceModule,
    NzImageModule,
    AgGridModule  
    ],
    declarations:[ debitMemoComponent, creditMemoComponent, creditMemoListComponent, debitMemoListComponent]
})
export class NotesModule {}