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
import { CustomersListComponent } from "./customers-list/customers-list.component";
import { CustomersRoutingModule } from "./customers-routing.module";
import { CustomersEditComponent } from "./customers-edit/customers-edit.component";

@NgModule({
    imports: [CommonModule,
    CustomersRoutingModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzGridModule,
    NzInputNumberModule,
    NzInputModule,
    NzSelectModule,
    CommonModule,
    AppCommonModule,
    NzTableModule,
    NzGridModule,
    NzSwitchModule,
    NzPaginationModule,
    NzInputNumberModule,
    NzCollapseModule,
    NzUploadModule,
    NzSpaceModule,
    NzImageModule  
    ],
    declarations:[CustomersListComponent, CustomersEditComponent ]
})
export class CustomerModule {}