import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrandsListComponent } from './brands-list/brands-list.component';
import { BrandsRoutingModule } from "./brands-routing.module";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzCollapseModule } from "ng-zorro-antd/collapse";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';

import { BrandsEditDrawerComponent } from "./brands-edit-drawer/brands-edit.drawer.component";

import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AppCommonModule } from 'src/app/common/app.common.module';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@NgModule({
  imports: [CommonModule,
    BrandsRoutingModule,
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
    InfiniteScrollModule
  ],
  declarations: [
    BrandsListComponent,
    BrandsEditDrawerComponent

  ]
})
export class BrandsModule { }