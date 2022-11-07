import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { UpdatePriceProductsComponent } from './update-price-product/update-price-products.component';

const routes: Routes =[
    {
        path: 'list', component: ProductsListComponent
    },
    {path: 'updateprice', component: UpdatePriceProductsComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingMoudule {}
