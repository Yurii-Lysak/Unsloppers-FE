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

  const canCreateResourcingRequests =
    isPermissionsSuccess &&
    permissionsData.permissions.includes(PERMISSION_KEYS.CREATE_RESOURCING_REQUESTS)

  const canFulfilResourcingRequests =
    isPermissionsSuccess &&
    permissionsData.permissions.includes(PERMISSION_KEYS.FULFIL_RESOURCING_REQUESTS)

  const canApproveRejectCandidates =
    isPermissionsSuccess &&
    permissionsData.permissions.includes(PERMISSION_KEYS.APPROVE_REJECT_CANDIDATES)

  const canAssignEndMentorships =
    isPermissionsSuccess &&
    permissionsData.permissions.includes(PERMISSION_KEYS.ASSIGN_END_MENTORSHIPS)

  return {
    permissionsData,
    isPermissionsLoading,
    isPermissionsError,
    isPermissionsSuccess,
    refetchPermissions,
    canManageFunctionalRoles,
    canCreateFormCampaigns,
    canCreateResourcingRequests,
    canFulfilResourcingRequests,
    canApproveRejectCandidates,
    canAssignEndMentorships,
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
