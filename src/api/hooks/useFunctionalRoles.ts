import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { functionalRoleApiService } from '@/api/services/functional-role.service'
import type {
  CreateFunctionalRoleInput,
  UpdateFunctionalRoleInput,
} from '@/types/functional-roles'

export const functionalRolesQueryKey = ['functional-roles', 'list'] as const
export const permissionCatalogQueryKey = ['permissions', 'catalog'] as const

/** Loads the role catalog for assignment multi-select (HR Admin only). */
export const useFunctionalRolesList = (enabled: boolean) =>
  useQuery({
    queryKey: functionalRolesQueryKey,
    queryFn: functionalRoleApiService.getFunctionalRolesList,
    enabled,
    retry: (_, error) => {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        return false
      }
      return true
    },
  })

export const usePermissionCatalog = (enabled: boolean) =>
  useQuery({
    queryKey: permissionCatalogQueryKey,
    queryFn: functionalRoleApiService.getPermissionCatalog,
    enabled,
    retry: (_, error) => {
      if (axios.isAxiosError(error) && error.response?.status && error.response.status >= 500) {
        return false
      }
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        return false
      }
      return true
    },
  })

export const useCreateFunctionalRole = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateFunctionalRoleInput) =>
      functionalRoleApiService.createFunctionalRole(input),
    onSuccess: async () => {
      toast.success(t('adminRoles.create.success'))
      await queryClient.invalidateQueries({ queryKey: functionalRolesQueryKey })
    },
    onError: () => {
      toast.error(t('adminRoles.create.error'))
    },
  })
}

export const useUpdateFunctionalRole = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFunctionalRoleInput }) =>
      functionalRoleApiService.updateFunctionalRole(id, input),
    onSuccess: async () => {
      toast.success(t('adminRoles.update.success'))
      await queryClient.invalidateQueries({ queryKey: functionalRolesQueryKey })
    },
    onError: () => {
      toast.error(t('adminRoles.update.error'))
    },
  })
}
