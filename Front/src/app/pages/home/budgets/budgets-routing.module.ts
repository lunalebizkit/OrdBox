import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetsEditComponent } from './budgets-edit/budgets-edit.component';
import { BudgetsListComponent } from './budgets-list/budgets-list.component';
import { BudgetsViewComponent } from './budgets-view/budgets-view.component';
const routes: Routes= [
    
    {path: '', component: BudgetsListComponent},
    {path: 'new', component: BudgetsEditComponent},
    {path: 'edit/:id',component: BudgetsViewComponent}
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BudgetsRoutingModule{}
