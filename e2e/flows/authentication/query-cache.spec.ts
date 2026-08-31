import { expect, test } from '@playwright/test'
import { QueryClient } from '@tanstack/react-query'
import { purgeProtectedQueryCache } from '../../../src/api/query-cache'

test('purges protected query data while retaining auth state', () => {
  const queryClient = new QueryClient()
  queryClient.setQueryData(['auth', 'session'], { userId: 'user-id' })
  queryClient.setQueryData(['employees'], [{ id: 'employee-id' }])
  queryClient.setQueryData(['profile', 'employee-id'], { name: 'Employee' })

  purgeProtectedQueryCache(queryClient)

  expect(queryClient.getQueryData(['auth', 'session'])).toEqual({
    userId: 'user-id',
  })
  expect(queryClient.getQueryData(['employees'])).toBeUndefined()
  expect(queryClient.getQueryData(['profile', 'employee-id'])).toBeUndefined()
})
