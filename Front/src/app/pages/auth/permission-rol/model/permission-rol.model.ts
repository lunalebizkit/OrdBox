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
export interface AddOrUpdatePermission {
    id: number,
    name: '',
    key: '',
    permissionIds: number[]
}