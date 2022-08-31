import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuppliersEditComponent } from './suppliers-edit/suppliers-edit.component';
import { SuppliersListComponent } from './suppliers-list/suppliers-list.component';



const routes: Routes=[
    { path: '', component: SuppliersListComponent},
    { path: 'edit/:id', component: SuppliersEditComponent},
    { path: 'new', component: SuppliersEditComponent},
]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class SuppliersRoutingModule {}