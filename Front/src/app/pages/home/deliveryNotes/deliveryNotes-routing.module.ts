import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeliveryNotesListComponent } from './deliveryNotes-list/deliveryNotes-list.component';
import { DeliveryNotesEditComponent } from './deliveryNotes-edit/deliveryNotes-edit.component';



const routes: Routes=[
    {path: '', component: DeliveryNotesListComponent},
    {path: 'new', component: DeliveryNotesEditComponent},
    { path: 'edit/:id', component: DeliveryNotesEditComponent},

]
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeliveryNotesRoutingModule {}