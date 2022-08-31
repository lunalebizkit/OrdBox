import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoriesRoutingModule } from './categories-routing.module';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CategoriesEditComponent } from './categories-edit/categories-edit.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormsModule } from '@angular/forms';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AppCommonModule } from 'src/app/common/app.common.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@NgModule({
    declarations: [
        CategoriesListComponent,
        CategoriesEditComponent
    ],
    imports: [
        CommonModule,
        CategoriesRoutingModule,
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
        NzCollapseModule

    ]
})
export class CategoriasModule { }