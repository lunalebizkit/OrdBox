import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesListComponent } from './categories-list/categories-list.component';



const routes: Routes=[
    {path: '', component: CategoriesListComponent},

]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoriesRoutingModule {}