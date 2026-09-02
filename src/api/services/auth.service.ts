import { apiClient } from '@/api/client'
import type { LoginCredentials, Session } from '@/types/api'

class AuthApiService {
  public getSession(): Promise<Session> {
    return apiClient.get<Session>('/api/v1/auth/session')
  }

  public login(credentials: LoginCredentials): Promise<Session> {
    return apiClient.post<Session>('/api/v1/auth/login', credentials)
  }

  public logout(): Promise<void> {
    return apiClient.post<void>('/api/v1/auth/logout')
  }
}

export const authApiService = new AuthApiService()
