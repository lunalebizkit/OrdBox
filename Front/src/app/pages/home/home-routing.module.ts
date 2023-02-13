import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/common/auth/permission/auth.guard';

import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        canActivate: [AuthGuard],
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsuariosModule),
      },

      {
        canActivate: [AuthGuard],
        path: 'products',
        loadChildren: () =>
          import('./products/products.module').then((m) => m.ProductsModule),
      },

      {
        canActivate: [AuthGuard],
        path: 'brands',
        loadChildren: () =>
          import('./brands/brands.module').then((m) => m.BrandsModule),
      },

      {
        canActivate: [AuthGuard],
        path: 'categories',
        loadChildren: () =>
          import('./categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        canActivate: [AuthGuard],
        path: 'suppliers',
        loadChildren: () =>
          import('./suppliers/suppliers.module').then((m) => m.SuppliersModule),
      },
      {
        canActivate: [AuthGuard],
        path: 'customers',
        loadChildren: () =>
          import('./customers/customers.module').then((m) => m.CustomerModule),
      },
      {
        canActivate: [AuthGuard],
        path: 'invoices',
        loadChildren: () =>
          import('./invoices/invoices.module').then((m) => m.InvoicesModule),
      },
      {
        canActivate: [AuthGuard],
        path: 'orders',
        loadChildren: () =>
          import('./orders/orders.module').then((m) => m.OrdersModule),
      },
      {
        canActivate: [AuthGuard],
        path: 'periods',
        loadChildren: () =>
          import('./periods/periods.module').then((m) => m.PeriodsModule),
      },
       {
        canActivate: [AuthGuard],
        path: 'iva',
        loadChildren: () =>
          import('./iva-report/iva-report.module').then((m) => m.IvaReportModule ),
      }, 
      {
        canActivate: [AuthGuard],
        path: 'notes',
        loadChildren: () =>
          import('./notes/notes.module').then((m) => m.NotesModule ),
      },
      {
        canActivate: [AuthGuard],
        path: 'report',
        loadChildren:()=>
          import('./report/report.module').then((m)=> m.ReportModule)
      }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
