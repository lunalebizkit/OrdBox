import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductsRoutingMoudule } from "./products-routing.module";
import { ProductsListComponent } from "./products-list/products-list.component";
import { ProductsEditComponent } from './products-edit/products-edit.component';

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

@NgModule({
    imports: [CommonModule,
    ProductsRoutingMoudule,
    NzLayoutModule,
    NzPageHeaderModule,
    NzGridModule,
    NzInputNumberModule,
    NzInputModule,
    NzSelectModule,
    CommonModule,
    AppCommonModule,
    // CategoryModule,
    NzTableModule,
    NzGridModule,
    NzSwitchModule,
    NzPaginationModule,
    // NzDatePickerModule,
    NzInputNumberModule,
    NzCollapseModule,
    NzUploadModule,
    // AttributeModule,
    NzSpaceModule,
    // AngularEditorModule,
    // NzTreeSelectModule,
    NzImageModule,
  
    // NzDescriptionsModule
    ],
    declarations:[ ProductsListComponent, ProductsEditComponent]
})
export class ProductsModule {}