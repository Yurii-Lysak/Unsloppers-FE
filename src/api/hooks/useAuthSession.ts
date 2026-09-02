import { useQuery } from '@tanstack/react-query'
import { getSessionApiCall } from '@/api/auth'
import { isUnauthorizedError } from '@/api/errors'
import type { Session } from '@/types/api'

export const authSessionQueryKey = ['auth', 'session'] as const
export const AUTH_SESSION_REFRESH_INTERVAL_MS = 60_000

export const fetchAuthSession = async (): Promise<Session | null> => {
  try {
    return await getSessionApiCall()
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return null
    }
    throw error
  }
}

export const useAuthSession = () =>
  useQuery({
    queryKey: authSessionQueryKey,
    queryFn: fetchAuthSession,
    retry: false,
    staleTime: 0,
    refetchInterval: AUTH_SESSION_REFRESH_INTERVAL_MS,
  })
