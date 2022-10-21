import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicesEditComponent } from './invoices-edit/invoices-edit.component';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { InvoicesViewComponent } from './invoices-view/invoices-view.component';

const routes: Routes =[
   
    { path: 'new', component: InvoicesEditComponent},
    { path: '', component: InvoicesListComponent},
    { path: 'view/:id', component: InvoicesViewComponent},
 
  
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoicesRoutingMoudule {}