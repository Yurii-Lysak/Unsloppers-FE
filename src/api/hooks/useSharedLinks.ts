import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  sharedLinkApiService,
  type CreateSharedLinkRequest,
} from '@/api/services/shared-link.service'

export const sharedLinkProfileQueryKey = (token: string) =>
  ['shared-links', token, 'profile'] as const

export const sharedLinksListQueryKey = (employeeId: string) =>
  ['shared-links', employeeId, 'list'] as const

export const sharedLinkAccessLogQueryKey = (employeeId: string, linkId: string) =>
  ['shared-links', employeeId, linkId, 'access-log'] as const

export const useCreateSharedLink = (employeeId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateSharedLinkRequest) =>
      sharedLinkApiService.createSharedLink(employeeId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: sharedLinksListQueryKey(employeeId),
      })
    },
  })
}

export const useSharedLinkProfile = (token: string) =>
  useQuery({
    queryKey: sharedLinkProfileQueryKey(token),
    queryFn: () => sharedLinkApiService.getSharedLinkProfile(token),
    enabled: token.length > 0,
  })

export const useSharedLinksList = (employeeId: string, enabled: boolean) =>
  useQuery({
    queryKey: sharedLinksListQueryKey(employeeId),
    queryFn: () => sharedLinkApiService.listSharedLinks(employeeId),
    enabled,
  })

export const useRevokeSharedLink = (employeeId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (linkId: string) =>
      sharedLinkApiService.revokeSharedLink(employeeId, linkId),
    onSuccess: async (_data, linkId) => {
      await queryClient.invalidateQueries({
        queryKey: sharedLinksListQueryKey(employeeId),
      })
      await queryClient.invalidateQueries({
        queryKey: sharedLinkAccessLogQueryKey(employeeId, linkId),
      })
    },
  })
}

export const useSharedLinkAccessLog = (
  employeeId: string,
  linkId: string | null,
) =>
  useQuery({
    queryKey: sharedLinkAccessLogQueryKey(employeeId, linkId ?? ''),
    queryFn: () => sharedLinkApiService.getSharedLinkAccessLog(employeeId, linkId!),
    enabled: Boolean(linkId),
  })
