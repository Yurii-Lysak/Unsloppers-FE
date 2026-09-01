import { usePermissionCatalog } from '@/api/hooks/useFunctionalRoles'
import { useMyPermissions } from '@/api/hooks/useMyPermissions'
import { PERMISSION_KEYS } from '@/types/permissions'

export const usePermissionsData = () => {
  const {
    data: permissionsData,
    isLoading: isPermissionsLoading,
    isError: isPermissionsError,
    isSuccess: isPermissionsSuccess,
    refetch: refetchPermissions,
  } = useMyPermissions()

  const canManageFunctionalRoles =
    isPermissionsSuccess &&
    permissionsData.permissions.includes(PERMISSION_KEYS.MANAGE_FUNCTIONAL_ROLES)

  const canCreateFormCampaigns =
    isPermissionsSuccess &&
    permissionsData.permissions.includes(PERMISSION_KEYS.CREATE_FORM_CAMPAIGNS)

  return {
    permissionsData,
    isPermissionsLoading,
    isPermissionsError,
    isPermissionsSuccess,
    refetchPermissions,
    canManageFunctionalRoles,
    canCreateFormCampaigns,
  }
}

export const usePermissionCatalogData = (enabled: boolean) => {
  const {
    data: permissionCatalog,
    isLoading: isCatalogLoading,
    isError: isCatalogError,
    isSuccess: isCatalogSuccess,
  } = usePermissionCatalog(enabled)

  return {
    permissionCatalog: permissionCatalog ?? [],
    isCatalogLoading,
    isCatalogError,
    isCatalogSuccess,
  }
}
