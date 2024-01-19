import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { UpdatePriceProductsComponent } from './update-price-product/update-price-products.component';
import { ProductsReportComponent } from './products-report/products-report.component';

const routes: Routes = [
    {
        path: '', component: ProductsListComponent,
    }, 
    { path: 'updateprice', component: UpdatePriceProductsComponent },
    { path: 'productsReport', component: ProductsReportComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsRoutingMoudule { }
