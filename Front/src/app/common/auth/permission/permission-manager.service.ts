import { AuthService } from '../interceptors/auth.service';
import { Injectable } from '@angular/core';
import { PermissionModel } from '../models/permission.model';
import { Permission } from '../models/permissions.enum';
import { Router } from '@angular/router';

@Injectable()
export class PermissionService {
  constructor(private auth: AuthService, private router: Router) {}

  permission: PermissionModel[] = [
    //#region Users
    {
      url: new RegExp('/home/users'),
      permissions: [
        Permission.ListUser,
        Permission.GetUser,
        Permission.CreateUser,
        Permission.DeleteUser,
        Permission.EditUser,
      ],
    },
    //#endregion

    //#region Brand
    {
      url: new RegExp('/home/brands'),
      permissions: [
        Permission.GetBrand,
        Permission.CreaterBrand,
        Permission.ListBrand,
        Permission.EditBrand,
      ],
    },
    //#endregion

    //#region Category
    {
      url: new RegExp('home/categories'),
      permissions: [
        Permission.GetCategory,
        Permission.CreateCategory,
        Permission.ListCategory,
        Permission.EditCategory,
      ],
    },
    //#endregion

    //#region Customer
    {
      url: new RegExp('/home/customers'),
      permissions: [
        Permission.CreaterCustomer,
        Permission.ListCustomer,
        Permission.GetCustomerByCuit,
        Permission.GetCustomerByCuit,
      ],
    },
    //#endregion

    //#region Entity
    {
      url: new RegExp('/home/entityt'),
      permissions: [
        Permission.GetEntity,
        Permission.CreateEntity,
        Permission.EditEntity,
        Permission.ListEntity,
      ],
    },
    //#endregion

    //#region Invoice
    {
      url: new RegExp('/home/invoices'),
      permissions: [Permission.GetInvoice, Permission.CreateInvoice],
    },
    //#endregion

    //#region Product
    {
      url: new RegExp('/home/products/list'),
      permissions: [
        Permission.GetProduct,
        Permission.CreateProduct,
        Permission.EditProduct,
        Permission.ListProduct,
      ],
    },
    //#endregion
    //#region Suppliers
    {
      url: new RegExp('/home/suppliers'),
      permissions: [
        Permission.GetSupplier,
        Permission.EditSupplier,
        Permission.ListSupplier,
        Permission.CreateSupplier,
      ],
    },
    //#endregion
    //#region OrderSupplier
    {
      url: new RegExp('/home/orders'),
      permissions: [
        Permission.GetOrderSupplier,
        Permission.CreateOrderSupplier,
        Permission.EditOrderSupplier,
        Permission.ListOrderSupplier,
      ],
    },
    //#endregion
    //#region UpdatePrice
    {
      url: new RegExp('/home/products/updateprice'),
      permissions: [Permission.ListUpdatePrice, Permission.EditUpdatePrice],
    },
    //#endregion
  ];

  public hasPermission(url: string) {
    if (!this.auth.currentUser) {
      return this.router.navigate(['auth/login']);
    }

    let permissions = this.auth.currentUser.permissions;

    let hasPermission = this.checkPermissions(url, permissions);
    if (!hasPermission) {
      this.router.navigate(['home/entity']);
    }

    return hasPermission;
  }

  private checkPermissions(url: string, permissions: Permission[]): boolean {
    let permissionUrl = this.permission.find((p) =>
      p.url.test(url)
    )?.permissions;

    if (!permissionUrl) return false;

    return permissions.findIndex((i) => permissionUrl?.includes(i)) !== -1;
  }

  public validatePermissionKey(permissionKey: Permission[]): boolean {
    let userPerms = this.auth.currentUser.permissions;

    let valid =
      userPerms && permissionKey.findIndex((i) => userPerms.includes(i)) !== -1;

    return valid;
  }
}
