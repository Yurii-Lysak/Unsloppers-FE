import { useQuery } from '@tanstack/react-query'
import { getMyPermissionsApiCall } from '@/api/permissions'
import { PERMISSION_KEYS } from '@/types/permissions'

export const myPermissionsQueryKey = ['permissions', 'me'] as const

export const useMyPermissions = () =>
  useQuery({
    queryKey: myPermissionsQueryKey,
    queryFn: getMyPermissionsApiCall,
    refetchOnWindowFocus: true,
  })

export const useHasPermission = (permissionKey: string) => {
  const query = useMyPermissions()
  if (!query.isSuccess) {
    return false
  }
  return query.data.permissions.includes(permissionKey)
}

export const useCanManageFunctionalRoles = () =>
  useHasPermission(PERMISSION_KEYS.MANAGE_FUNCTIONAL_ROLES)

export const useCanCreateFormCampaigns = () =>
  useHasPermission(PERMISSION_KEYS.CREATE_FORM_CAMPAIGNS)
