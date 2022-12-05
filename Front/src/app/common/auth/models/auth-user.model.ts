import { Permission } from 'src/app/common/auth/models/permissions.enum';
export class AuthUserModel {
  userName!: string;
  fullName!: string;
  refreshToken!: string;
  token!: string;
  rol!: string;
  permisos!: Permission[];
}
