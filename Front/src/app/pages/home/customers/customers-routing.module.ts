import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersEditComponent } from './customers-edit/customers-edit.component';
import { CustomersListComponent } from './customers-list/customers-list.component';


const routes: Routes=[
    { path: '', component: CustomersListComponent},
    { path: 'edit/:id', component: CustomersEditComponent},
    { path: 'new', component: CustomersEditComponent},
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class CustomersRoutingModule {}