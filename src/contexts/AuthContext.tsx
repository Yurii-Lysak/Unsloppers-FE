import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { authSessionQueryKey, useAuthSession } from '@/api/hooks/useAuthSession'
import { useLogin } from '@/api/hooks/useLogin'
import { useLogout } from '@/api/hooks/useLogout'
import { isUnauthorizedError } from '@/api/errors'
import { purgeProtectedQueryCache } from '@/api/query-cache'
import type { LoginCredentials, Session } from '@/types/api'

/* eslint-disable react-refresh/only-export-components */

interface AuthContextValue {
  session: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated' | 'unavailable'
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  retrySession: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient()
  const sessionQuery = useAuthSession()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  useEffect(
    () =>
      apiClient.onUnauthorized(() => {
        queryClient.setQueryData(authSessionQueryKey, null)
        purgeProtectedQueryCache(queryClient)
      }),
    [queryClient]
  )

  const login = async (credentials: LoginCredentials) => {
    await queryClient.cancelQueries({ queryKey: authSessionQueryKey })
    const authenticatedSession = await loginMutation.mutateAsync(credentials)
    queryClient.setQueryData(authSessionQueryKey, authenticatedSession)
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
    queryClient.setQueryData(authSessionQueryKey, null)
    purgeProtectedQueryCache(queryClient)
  }

  const status: AuthContextValue['status'] = sessionQuery.isPending
    ? 'loading'
    : sessionQuery.isError && !isUnauthorizedError(sessionQuery.error)
      ? 'unavailable'
      : sessionQuery.data
        ? 'authenticated'
        : 'unauthenticated'

  return (
    <AuthContext.Provider
      value={{
        session: sessionQuery.data ?? null,
        status,
        login,
        logout,
        retrySession: () => void sessionQuery.refetch(),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
