export interface Role {
  id: string
  nom: string
  description: string
  permissions?: Permission[]
}

export interface Permission {
  id: string
  nom: string
  description: string
}

export interface RolePermissionRequest {
  permissionIds: string[]
}
