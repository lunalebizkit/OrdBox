import { NgModule } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
// import { AuthGuard } from "./interceptors/auth.guard";
// import { AuthService } from "./interceptors/auth.service";
import { NzMessageModule } from 'ng-zorro-antd/message';
import { AuthGuard } from './permission/auth.guard';
import { PermissionService } from './permission/permission-manager.service';
// import {AuthGuardChildren} from './interceptors/auth.children.guard';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [],
  imports: [],
  providers: [AuthGuard, PermissionService],
})
export class AuthModule {}
