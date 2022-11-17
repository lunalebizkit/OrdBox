import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicesEditComponent } from './invoices-edit/invoices-edit.component';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';

const routes: Routes =[
   
    { path: 'new', component: InvoicesEditComponent},
    { path: '', component: InvoicesListComponent},
   
 
  
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoicesRoutingMoudule {}