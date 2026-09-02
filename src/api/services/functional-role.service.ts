import { apiClient } from '@/api/client'
import type {
  CreateFunctionalRoleInput,
  FunctionalRole,
  PermissionCatalogEntry,
  UpdateFunctionalRoleInput,
} from '@/types/functional-roles'

class FunctionalRoleApiService {
  public getFunctionalRolesList(): Promise<FunctionalRole[]> {
    return apiClient.get<FunctionalRole[]>('/api/v1/functional-roles')
  }

  public getPermissionCatalog(): Promise<PermissionCatalogEntry[]> {
    return apiClient.get<PermissionCatalogEntry[]>('/api/v1/permissions/catalog')
  }

  public createFunctionalRole(input: CreateFunctionalRoleInput): Promise<FunctionalRole> {
    return apiClient.post<FunctionalRole>('/api/v1/functional-roles', input)
  }

  public updateFunctionalRole(id: string, input: UpdateFunctionalRoleInput): Promise<FunctionalRole> {
    return apiClient.patch<FunctionalRole>(`/api/v1/functional-roles/${id}`, input)
  }

  public deleteFunctionalRole(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/v1/functional-roles/${id}`)
  }
}

export const functionalRoleApiService = new FunctionalRoleApiService()
