import { apiClient } from '@/api/client'
import type {
  CreateFunctionalRoleInput,
  FunctionalRole,
  PermissionCatalogEntry,
  UpdateFunctionalRoleInput,
} from '@/types/functional-roles'

export const listFunctionalRolesApiCall = () =>
  apiClient.get<FunctionalRole[]>('/api/v1/functional-roles')

export const getPermissionCatalogApiCall = () =>
  apiClient.get<PermissionCatalogEntry[]>('/api/v1/permissions/catalog')

export const createFunctionalRoleApiCall = (input: CreateFunctionalRoleInput) =>
  apiClient.post<FunctionalRole>('/api/v1/functional-roles', input)

export const updateFunctionalRoleApiCall = (id: string, input: UpdateFunctionalRoleInput) =>
  apiClient.patch<FunctionalRole>(`/api/v1/functional-roles/${id}`, input)

export const deleteFunctionalRoleApiCall = (id: string) =>
  apiClient.delete<void>(`/api/v1/functional-roles/${id}`)
