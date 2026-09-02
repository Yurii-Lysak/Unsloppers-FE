import { useMutation, useQuery } from '@tanstack/react-query'
import {
  sharedLinkApiService,
  type CreateSharedLinkRequest,
} from '@/api/services/shared-link.service'

export const sharedLinkProfileQueryKey = (token: string) =>
  ['shared-links', token, 'profile'] as const

export const useCreateSharedLink = (employeeId: string) =>
  useMutation({
    mutationFn: (body: CreateSharedLinkRequest) =>
      sharedLinkApiService.createSharedLink(employeeId, body),
  })

export const useSharedLinkProfile = (token: string) =>
  useQuery({
    queryKey: sharedLinkProfileQueryKey(token),
    queryFn: () => sharedLinkApiService.getSharedLinkProfile(token),
    enabled: Boolean(token),
  })
