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
import { SuppliersRoutingModule } from "./suppliers-routing.module";
import { SuppliersListComponent } from "./suppliers-list/suppliers-list.component";
import { SuppliersEditDrawerComponent } from "./suppliers-edit-drawer/suppliers-edit.drawer.component";

@NgModule({
    imports: [CommonModule,
    SuppliersRoutingModule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzGridModule,
    NzInputNumberModule,
    NzInputModule,
    NzSelectModule,
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
    declarations:[SuppliersListComponent, SuppliersEditDrawerComponent ]
})
export class SuppliersModule {}