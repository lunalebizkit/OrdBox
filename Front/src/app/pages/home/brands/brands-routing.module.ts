import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandsListComponent } from './brands-list/brands-list.component';

const routes: Routes= [
    {path: '', component: BrandsListComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BrandsRoutingModule {}