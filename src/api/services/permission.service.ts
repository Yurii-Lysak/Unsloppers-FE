import { apiClient } from '@/api/client'
import type { MyPermissions } from '@/types/permissions'

class PermissionApiService {
  public getMyPermissions(): Promise<MyPermissions> {
    return apiClient.get<MyPermissions>('/api/v1/permissions/me')
  }
}

export const permissionApiService = new PermissionApiService()
