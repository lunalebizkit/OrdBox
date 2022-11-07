import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsuariosModule),
      },

      {
        path: 'products',
        loadChildren: () =>
          import('./products/products.module').then((m) => m.ProductsModule),
      },

      {
        path: 'brands',
        loadChildren: () =>
          import('./brands/brands.module').then((m) => m.BrandsModule),
      },

      {
        path: 'categories',
        loadChildren: () =>
          import('./categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./suppliers/suppliers.module').then((m) => m.SuppliersModule),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./customers/customers.module').then((m) => m.CustomerModule),
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('./invoices/invoices.module').then((m) => m.InvoicesModule),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./orders/orders.module').then((m) => m.OrdersModule),
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
