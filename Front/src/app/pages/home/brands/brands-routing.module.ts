import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandsEditComponent } from './brands-edit/brands-edit.component';
import { BrandsListComponent } from './brands-list/brands-list.component';

const routes: Routes= [
    {path: '', component: BrandsListComponent},
    {path: 'new', component: BrandsEditComponent},
    {path: 'edit/:id', component: BrandsEditComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BrandsRoutingModule {}