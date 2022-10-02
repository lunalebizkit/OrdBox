import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzPageHeaderModule } from "ng-zorro-antd/page-header";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSelectModule } from "ng-zorro-antd/select";
import { AppCommonModule } from "src/app/common/app.common.module";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzSpaceModule } from "ng-zorro-antd/space";
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzPaginationModule } from "ng-zorro-antd/pagination";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzListModule } from 'ng-zorro-antd/list';

import { InvoicesRoutingMoudule } from "./invoices-routing.module";
import { InvoicesEditComponent } from "./invoices-edit/invoices-edit.component";
import { InvoiceCustomerSearchComponent } from './invoice-customer-search/invoice-customer-search.component';
import { InvoiceProductSearchComponent } from "./invoice-product-search/invoice-product-search.component";
import { InvoiceProductSearchQuantityComponent } from "./invoice-product-search-quantity/invoice-product-search-quantity.component";


@NgModule({
    imports: [CommonModule,
        InvoicesRoutingMoudule,
        NzButtonModule,
        NzToolTipModule,
        NzListModule,
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
        NzSpaceModule,
        NzDatePickerModule,
        NzDescriptionsModule,
        

    ],
    declarations: [InvoicesEditComponent,
         InvoiceCustomerSearchComponent, 
         InvoiceProductSearchComponent, 
         InvoiceProductSearchQuantityComponent]
})
export class InvoicesModule { }