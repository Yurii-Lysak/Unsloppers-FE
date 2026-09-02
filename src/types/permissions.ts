export interface MyPermissions {
  permissions: string[]
}

export const PERMISSION_KEYS = {
  CREATE_FORM_CAMPAIGNS: 'create_form_campaigns',
  MANAGE_FUNCTIONAL_ROLES: 'manage_functional_roles',
} as const

export type PermissionKey = (typeof PERMISSION_KEYS)[keyof typeof PERMISSION_KEYS]
