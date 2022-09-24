import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicesEditComponent } from './invoices-edit/invoices-edit.component';

const routes: Routes =[
   
    { path: 'new', component: InvoicesEditComponent},
 
  
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoicesRoutingMoudule {}