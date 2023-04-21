import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetsViewComponent } from './pages/home/budgets/budgets-view/budgets-view.component';

const routes: Routes = [
  
 { path: '', redirectTo: 'auth/login', pathMatch: 'full'},
 {
  path:'auth', loadChildren: ()=>import('./pages/auth/security-auth.routing').then(m => m.SecurityAuthRoutingModule)},

  {path: 'home', loadChildren: ()=> import('./pages/home/home.module').then(m => m.HomeModule)},

  {path:'_/:id',component:BudgetsViewComponent}

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
