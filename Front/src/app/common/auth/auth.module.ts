import { NgModule } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { AuthGuard } from './permission/auth.guard';
import { PermissionService } from './permission/permission-manager.service';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [],
  imports: [],
  providers: [AuthGuard, PermissionService],
})
export class AuthModule {}
