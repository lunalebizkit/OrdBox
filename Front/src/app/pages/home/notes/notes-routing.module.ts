import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditMemoComponent } from './credit-memo/credit-memo.component';
import { creditMemoListComponent } from './creditMemo-list/creditMemo-list.component';
import { debitMemoComponent } from './debit-memo/debit-memo.component';
import { debitMemoListComponent } from './debitMemo-list/debitMemo-list.component';


const routes: Routes =[
    { path: 'debit', component: debitMemoComponent },
    {path: 'debitList', component: debitMemoListComponent },
    {path: 'credit', component: CreditMemoComponent },
    {path: 'creditList', component: creditMemoListComponent },

   
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotesRoutingModule {}