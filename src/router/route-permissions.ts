import { matchPath } from 'react-router-dom'
import {
  PERMISSION_KEYS,
  type PermissionKey,
} from '@/types/permissions'

export interface RoutePermissionRule {
  pattern: string
  /** Route renders when the viewer holds any one of these permissions. */
  permissions: PermissionKey[]
}

/** Routes that require a permission before the page renders. Order does not matter. */
export const ROUTE_PERMISSION_RULES: RoutePermissionRule[] = [
  {
    pattern: '/admin/roles',
    permissions: [PERMISSION_KEYS.MANAGE_FUNCTIONAL_ROLES],
  },
  {
    pattern: '/employees/:employeeId/functional-roles',
    permissions: [PERMISSION_KEYS.MANAGE_FUNCTIONAL_ROLES],
  },
  {
    pattern: '/campaigns',
    permissions: [PERMISSION_KEYS.CREATE_FORM_CAMPAIGNS],
  },
  {
    // Story 6.2 — DM/PM create/list holders and UM fulfil-only holders both
    // reach the list; the page itself scopes what each sees.
    pattern: '/resourcing',
    permissions: [
      PERMISSION_KEYS.CREATE_RESOURCING_REQUESTS,
      PERMISSION_KEYS.FULFIL_RESOURCING_REQUESTS,
    ],
  },
  {
    pattern: '/resourcing/:requestId',
    permissions: [
      PERMISSION_KEYS.CREATE_RESOURCING_REQUESTS,
      PERMISSION_KEYS.FULFIL_RESOURCING_REQUESTS,
    ],
  },
]

export const getRequiredPermissions = (
  pathname: string,
): PermissionKey[] | undefined => {
  for (const rule of ROUTE_PERMISSION_RULES) {
    if (matchPath({ path: rule.pattern, end: true }, pathname)) {
      return rule.permissions
    }
  }
  return undefined
}

export const hasAnyPermissionKey = (
  permissions: string[],
  required: PermissionKey[],
): boolean => required.some(permission => permissions.includes(permission))
