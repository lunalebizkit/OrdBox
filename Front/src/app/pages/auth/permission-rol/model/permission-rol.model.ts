export interface PermissionRol{
    rol: string,
    permissions: Permission[]
};
export interface Permission{
    id: number,
    name: string,
    key: string,
    enumPermission: number
}