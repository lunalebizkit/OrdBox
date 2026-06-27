import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionRolComponent } from './permission/permission-rol.component';


const routes: Routes = [
 {
  path:'', component: PermissionRolComponent
 }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionRolRoutingModule {}