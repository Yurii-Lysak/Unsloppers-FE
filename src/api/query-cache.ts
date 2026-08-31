import type { QueryClient } from '@tanstack/react-query'

export const purgeProtectedQueryCache = (queryClient: QueryClient): void => {
  queryClient.removeQueries({
    predicate: query => query.queryKey[0] !== 'auth',
  })
}
