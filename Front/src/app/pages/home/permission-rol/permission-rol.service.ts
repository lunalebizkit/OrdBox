import { Injectable } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { ApiService } from "src/app/common/services/api.base.service";
import { AddOrUpdatePermission } from "./permission/model/permission-rol.model";

@Injectable({
    providedIn: 'root',
  })
  export class PermissionRolService {

constructor(public api: ApiService) {}

public permissionList(): Observable<any> {
    return this.api.post(`Rol/ListPermissions`,  false);
  }
  public permissionRolList(): Observable<any> {
    return this.api.post(`Rol/ListRolPermissions`,  false);
  };

  public addOrUpdatePermissions(model: AddOrUpdatePermission): Observable<any> {
    return this.api.post(`Rol/addorupdatepermission`, model,  false);
  }
}