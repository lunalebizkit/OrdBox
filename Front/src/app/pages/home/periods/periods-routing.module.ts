import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeriodsListComponent } from './periods-list/periods-list.component';

const routes: Routes= [
    {path: '', component: PeriodsListComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PeriodsRoutingModule {}