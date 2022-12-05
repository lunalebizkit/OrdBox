import {
  Directive,
  EmbeddedViewRef,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { PermissionService } from '../auth/permission/permission-manager.service';
import { Permission } from '../auth/models/permissions.enum';

@Directive({
  selector: '[authPermission]',
})
export class PermissionDirective {
  private _permissionKey!: Permission[];
  private _viewRef: EmbeddedViewRef<any> | null = null;
  private _templateRef: TemplateRef<any> | null = null;

  @Input()
  set authPermission(permission: Permission[]) {
    this._permissionKey = permission;
    this._viewRef = null;
    this.init();
  }
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private permission: PermissionService
  ) {
    this._templateRef = templateRef;
  }

  init() {
    const isPermitted = this.permission.validatePermissionKey(
      this._permissionKey
    );
    if (!isPermitted) return;

    this._viewRef = this.viewContainerRef.createEmbeddedView(this.templateRef);
  }
}
