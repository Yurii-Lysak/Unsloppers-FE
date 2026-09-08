import { useQuery } from '@tanstack/react-query'
import { resourcingApiService } from '@/api/services/resourcing.service'

export const resourcingListQueryKey = ['resourcing', 'list'] as const

export const useResourcingRequestsList = (enabled = true) =>
  useQuery({
    queryKey: resourcingListQueryKey,
    queryFn: resourcingApiService.getRequestsList,
    enabled,
  })
