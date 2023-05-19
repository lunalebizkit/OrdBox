import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuittanceListComponent } from './quittance-list/quittance-list.component';
import { QuittanceEditComponent } from './quittance-edit/quittance-edit.component';

const routes: Routes = [
  { path: '', component: QuittanceListComponent  },
  { path: 'new', component: QuittanceEditComponent  },
  { path: 'edit/:id', component: QuittanceEditComponent},
 
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuittanceRoutingModule {}