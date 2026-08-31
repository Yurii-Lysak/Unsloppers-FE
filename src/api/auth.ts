import { apiClient } from '@/api/client'
import type { LoginCredentials, Session } from '@/types/api'

export const getSessionApiCall = () => apiClient.get<Session>('/api/v1/auth/session')

export const loginApiCall = (credentials: LoginCredentials) =>
  apiClient.post<Session>('/api/v1/auth/login', credentials)

export const logoutApiCall = () => apiClient.post<void>('/api/v1/auth/logout')
