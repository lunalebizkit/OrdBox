import { Permission } from "src/app/pages/auth/permission/permissions.enum";
export class AuthUserModel {
    userName!: string;
    fullName!: string;
    refreshToken!: string;
    token!: string;
    rol!: string;
    permissions!: Permission[];
}