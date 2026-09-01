import { useLocation } from 'react-router-dom'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'
import {
  getRequiredPermission,
  hasPermissionKey,
} from '@/router/route-permissions'
import type { PermissionKey } from '@/types/permissions'

export const useRoutePermissionCheck = () => {
  const location = useLocation()
  const {
    permissionsData,
    isPermissionsLoading,
    isPermissionsError,
    isPermissionsSuccess,
    refetchPermissions,
  } = usePermissionsData()

  const requiredPermission = getRequiredPermission(location.pathname)

  const hasPermission = (permission: PermissionKey) =>
    isPermissionsSuccess &&
    permissionsData !== undefined &&
    hasPermissionKey(permissionsData.permissions, permission)

  const isAuthorized =
    requiredPermission === undefined ||
    (isPermissionsSuccess && hasPermission(requiredPermission))

  return {
    requiredPermission,
    isPermissionsLoading: requiredPermission !== undefined && isPermissionsLoading,
    isPermissionsError: requiredPermission !== undefined && isPermissionsError,
    isAuthorized,
    refetchPermissions,
  }
}
