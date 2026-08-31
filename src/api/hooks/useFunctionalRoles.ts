import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  createFunctionalRoleApiCall,
  getPermissionCatalogApiCall,
  listFunctionalRolesApiCall,
  updateFunctionalRoleApiCall,
} from '@/api/functional-roles'
import type {
  CreateFunctionalRoleInput,
  UpdateFunctionalRoleInput,
} from '@/types/functional-roles'

export const functionalRolesQueryKey = ['functional-roles', 'list'] as const
export const permissionCatalogQueryKey = ['permissions', 'catalog'] as const

export const useFunctionalRolesAccess = () =>
  useQuery({
    queryKey: functionalRolesQueryKey,
    queryFn: listFunctionalRolesApiCall,
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
    queryFn: getPermissionCatalogApiCall,
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateFunctionalRoleInput) => createFunctionalRoleApiCall(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: functionalRolesQueryKey })
    },
  })
}

export const useUpdateFunctionalRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFunctionalRoleInput }) =>
      updateFunctionalRoleApiCall(id, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: functionalRolesQueryKey })
    },
  })
}
