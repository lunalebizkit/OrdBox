import { AuthService } from '../interceptors/auth.service';
import { Injectable } from "@angular/core";
import { PermissionModel } from '../../../pages/auth/permission/permission.model';
import { Permission } from '../../../pages/auth/permission/permissions.enum';
import { Router } from '@angular/router';

@Injectable()
export class PermissionService {

  constructor(private auth: AuthService, private router: Router) { }

  permission: PermissionModel[] = [

    //#region Commission
    { url:  new RegExp ('/home/commission'), permissions: [Permission.visualizeCommission] },
    //#endregion

    //#region Entity
    { url: new RegExp ('/home/entity/list'), permissions: [Permission.visualizeEntity] },
    { url: new RegExp ('/home/entity/new'), permissions: [Permission.editEntity] },
    { url: new RegExp ('/home/entity/edit/[1-9](\\d*)'), permissions: [Permission.editEntity] },
    { url: new RegExp ('/home/entity/[1-9](\\d*)/bills'), permissions: [Permission.visualizeBillingEntity] },
    //#endregion

    //#region Operations
    { url: new RegExp ('/home/entity/[1-9](\\d*)/operations/pay-order'), permissions: [Permission.payOrder] },
    { url: new RegExp ('/home/entity/[1-9](\\d*)/operations/withdraw'), permissions: [Permission.withdraw] },
    { url: new RegExp ('/home/entity/[1-9](\\d*)/operations/check'), permissions: [Permission.check] },
    { url: new RegExp ('/home/entity/[1-9](\\d*)/operations/bill'), permissions: [Permission.instrument] },
    { url: new RegExp ('/home/entity/[1-9](\\d*)/operations/pay-order/payment/[1-9](\\d*)'), permissions: [Permission.payOrderProv] }, //Pagar Prov
    { url: new RegExp ('/home/entity/[1-9](\\d*)/operations'), permissions: [Permission.visualizeOperations] },
    //#endregion

    //#region User
    { url: new RegExp ('/home/user/list'), permissions: [Permission.visualizeUser] },
    { url: new RegExp ('/home/user/new'), permissions: [Permission.editUser] },
    { url: new RegExp ('/home/user/edit/[1-9](\\d*)'), permissions: [Permission.editUser] },
    //#endregion

    //#region Instrument Management
    { url:  new RegExp ('/home/instrument-management/list'), permissions: [Permission.visualizeInstrument] },
    //#endregion

    //#region Massive
    { url:  new RegExp ('/home/massive-billing/list'), permissions: [Permission.visualizeMassiveEntity] },
    //#endregion

    //#region Processes
    { url:  new RegExp ('/home/process'), permissions: [Permission.visualizeProcesses] },
    //#endregion
  ];

  public hasPermission(url: string) {
    if (!this.auth.currentUser) {
      return this.router.navigate(['auth/login']);
    }

    let permissions = this.auth.currentUser.permissions;

    let hasPermission = this.checkPermissions(url, permissions);
    if(!hasPermission){
      this.router.navigate(['home/entity']);
    }

    return hasPermission;
  }

  private checkPermissions(url: string, permissions: Permission[]): boolean {
    let permissionUrl = this.permission.find(p => p.url.test(url))?.permissions;

    if(!permissionUrl) return false;

    return permissions.findIndex( i => permissionUrl?.includes(i)) !== -1;
  }

  public validatePermissionKey(permissionKey: Permission[]): boolean{
    let userPerms = this.auth.currentUser.permissions;

    let valid = userPerms && permissionKey.findIndex( i => userPerms.includes(i)) !== -1;

    return valid;
  }
}
