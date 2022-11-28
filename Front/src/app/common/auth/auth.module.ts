import { NgModule } from "@angular/core";
// import { AuthGuard } from "./interceptors/auth.guard";
// import { AuthService } from "./interceptors/auth.service";
import { NzMessageModule } from 'ng-zorro-antd/message';
import { AuthGuard } from "./permission/auth.guard";
import { PermissionService } from "./permission/permission-manager.service";
// import {AuthGuardChildren} from './interceptors/auth.children.guard';

@NgModule({
  declarations: [],
  imports: [NzMessageModule],
   providers: [ AuthGuard, PermissionService]
})

export class AuthModule { }
