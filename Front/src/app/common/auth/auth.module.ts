import { NgModule } from "@angular/core";
// import { AuthGuard } from "./interceptors/auth.guard";
// import { AuthService } from "./interceptors/auth.service";
import { NzMessageModule } from 'ng-zorro-antd/message';
// import {AuthGuardChildren} from './interceptors/auth.children.guard';

@NgModule({
  declarations: [],
  imports: [NzMessageModule],
  // providers: [AuthService, AuthGuard, AuthGuardChildren]
})

export class AuthModule { }
