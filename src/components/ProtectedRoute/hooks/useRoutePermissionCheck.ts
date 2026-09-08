import { useLocation } from 'react-router-dom'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'
import {
  getRequiredPermissions,
  hasAnyPermissionKey,
} from '@/router/route-permissions'

export const useRoutePermissionCheck = () => {
  const location = useLocation()
  const {
    permissionsData,
    isPermissionsLoading,
    isPermissionsError,
    isPermissionsSuccess,
    refetchPermissions,
  } = usePermissionsData()

  const requiredPermissions = getRequiredPermissions(location.pathname)

  const isAuthorized =
    requiredPermissions === undefined ||
    (isPermissionsSuccess &&
      permissionsData !== undefined &&
      hasAnyPermissionKey(permissionsData.permissions, requiredPermissions))

  return {
    requiredPermissions,
    isPermissionsLoading: requiredPermissions !== undefined && isPermissionsLoading,
    isPermissionsError: requiredPermissions !== undefined && isPermissionsError,
    isAuthorized,
    refetchPermissions,
  }
}
