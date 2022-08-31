import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersEditComponent } from './users-edit/users-edit.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
    {
      path: '', component: UsersListComponent
    },
    {
      path: 'edit/:id', component: UsersEditComponent
    },
    {
      path: 'new', component: UsersEditComponent
    }
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class UserRoutingModule { }