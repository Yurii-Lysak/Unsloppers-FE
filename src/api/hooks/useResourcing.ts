import { useQuery } from '@tanstack/react-query'
import { resourcingApiService } from '@/api/services/resourcing.service'

export const resourcingListQueryKey = ['resourcing', 'list'] as const
export const resourcingAssignedListQueryKey = ['resourcing', 'assigned'] as const
export const resourcingPendingReviewListQueryKey = [
  'resourcing',
  'pending-review',
] as const
export const resourcingDetailQueryKey = (requestId: string) =>
  ['resourcing', 'detail', requestId] as const

export const useResourcingRequestsList = (enabled = true) =>
  useQuery({
    queryKey: resourcingListQueryKey,
    queryFn: resourcingApiService.getRequestsList,
    enabled,
  })

export const useResourcingAssignedRequestsList = (enabled = true) =>
  useQuery({
    queryKey: resourcingAssignedListQueryKey,
    queryFn: resourcingApiService.getAssignedRequestsList,
    enabled,
  })

export const useResourcingPendingReviewRequestsList = (enabled = true) =>
  useQuery({
    queryKey: resourcingPendingReviewListQueryKey,
    queryFn: resourcingApiService.getPendingReviewRequestsList,
    enabled,
  })

export const useResourcingRequestDetail = (requestId: string, enabled = true) =>
  useQuery({
    queryKey: resourcingDetailQueryKey(requestId),
    queryFn: () => resourcingApiService.getRequestDetail(requestId),
    enabled,
  })
