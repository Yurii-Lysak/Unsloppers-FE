import { matchPath } from 'react-router-dom'
import {
  PERMISSION_KEYS,
  type PermissionKey,
} from '@/types/permissions'

export interface RoutePermissionRule {
  pattern: string
  permission: PermissionKey
}

/** Routes that require a permission before the page renders. Order does not matter. */
export const ROUTE_PERMISSION_RULES: RoutePermissionRule[] = [
  {
    pattern: '/admin/roles',
    permission: PERMISSION_KEYS.MANAGE_FUNCTIONAL_ROLES,
  },
  {
    pattern: '/employees/:employeeId/functional-roles',
    permission: PERMISSION_KEYS.MANAGE_FUNCTIONAL_ROLES,
  },
  {
    pattern: '/campaigns',
    permission: PERMISSION_KEYS.CREATE_FORM_CAMPAIGNS,
  },
]

export const getRequiredPermission = (
  pathname: string,
): PermissionKey | undefined => {
  for (const rule of ROUTE_PERMISSION_RULES) {
    if (matchPath({ path: rule.pattern, end: true }, pathname)) {
      return rule.permission
    }
  }
  return undefined
}

export const hasPermissionKey = (
  permissions: string[],
  permission: PermissionKey,
): boolean => permissions.includes(permission)
