import { useQuery } from '@tanstack/react-query'
import { getSessionApiCall } from '@/api/auth'

export const authSessionQueryKey = ['auth', 'session'] as const
export const AUTH_SESSION_REFRESH_INTERVAL_MS = 60_000

export const useAuthSession = () =>
  useQuery({
    queryKey: authSessionQueryKey,
    queryFn: getSessionApiCall,
    retry: false,
    staleTime: 0,
    refetchInterval: AUTH_SESSION_REFRESH_INTERVAL_MS,
  })
