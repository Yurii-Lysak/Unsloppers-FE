export interface MyPermissions {
  permissions: string[]
}

export const PERMISSION_KEYS = {
  CREATE_FORM_CAMPAIGNS: 'create_form_campaigns',
  CREATE_RESOURCING_REQUESTS: 'create_resourcing_requests',
  FULFIL_RESOURCING_REQUESTS: 'fulfil_resourcing_requests',
  MANAGE_FUNCTIONAL_ROLES: 'manage_functional_roles',
} as const

export type PermissionKey = (typeof PERMISSION_KEYS)[keyof typeof PERMISSION_KEYS]
