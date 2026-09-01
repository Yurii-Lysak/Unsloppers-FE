import { apiClient } from '@/api/client'

export interface MyPermissions {
  permissions: string[]
}

export const getMyPermissionsApiCall = () =>
  apiClient.get<MyPermissions>('/api/v1/permissions/me')
