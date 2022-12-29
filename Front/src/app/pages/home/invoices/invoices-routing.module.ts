import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoicesEditComponent } from './invoices-edit/invoices-edit.component';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { ReceiptEditComponent } from './receipt-edit/receipt-edit.component';

const routes: Routes = [
  { path: 'invoices-sale', component: InvoicesListComponent },
  { path: 'invoices-sale/new', component: InvoicesEditComponent },
  { path: 'receipt', component: ReceiptListComponent },
  { path: 'receipt/new', component: ReceiptEditComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesRoutingMoudule {}
