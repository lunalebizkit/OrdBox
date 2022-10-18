import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AgGridModule } from 'ag-grid-angular';
import { UsuariosModule } from './users/users.module';
import { ModuleRegistry } from '@ag-grid-community/core';
// import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model';

// ModuleRegistry.registerModules([InfiniteRowModelModule]);

@NgModule({
  declarations: [
    HomeComponent
    
  ],
  imports: [
    HomeRoutingModule,
    CommonModule,
    NzLayoutModule,
    NzDropDownModule,
    NzAvatarModule,
    NzMenuModule,
    IconsProviderModule,    
    NzDividerModule,
    UsuariosModule,
    AgGridModule,
  ],
  exports: [HomeComponent]
})
export class HomeModule { }
