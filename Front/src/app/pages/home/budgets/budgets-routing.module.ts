import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetsEditComponent } from './budgets-edit/budgets-edit.component';
import { BudgetsListComponent } from './budgets-list/budgets-list.component';
const routes: Routes= [
    
    {path: '', component: BudgetsListComponent},
    {path: 'new', component: BudgetsEditComponent},
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BudgetsRoutingModule{}
