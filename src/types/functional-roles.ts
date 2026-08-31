export interface FunctionalRole {
  id: string
  name: string
  isBuiltIn: boolean
  permissionKeys: string[]
}

export interface PermissionCatalogEntry {
  key: string
  label: string
  description?: string
}

export interface CreateFunctionalRoleInput {
  name: string
  permissionKeys: string[]
}

export interface UpdateFunctionalRoleInput {
  name?: string
  permissionKeys?: string[]
}
