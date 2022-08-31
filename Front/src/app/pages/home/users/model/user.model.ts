import { RolModel } from "./rol.model";

export interface UserModel {
  id:number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  roleId: RolModel;
}
