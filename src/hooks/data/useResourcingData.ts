import { useResourcingRequestsList } from '@/api/hooks/useResourcing'
import { useCreateResourcingRequest } from '@/api/hooks/useResourcingMutations'
import type { CreateResourcingRequestInput } from '@/types/resourcing'

export { resourcingListQueryKey } from '@/api/hooks/useResourcing'

export const useResourcingListData = (enabled = true) => {
  const {
    data: requestsList,
    isLoading: isRequestsLoading,
    isError: isRequestsError,
  } = useResourcingRequestsList(enabled)

  return {
    requestsList,
    isRequestsLoading,
    isRequestsError,
  }
}

export const useResourcingMutations = () => {
  const createRequestMutation = useCreateResourcingRequest()

  const createRequest = async (input: CreateResourcingRequestInput) => {
    await createRequestMutation.mutateAsync(input)
  }

  const resetMutationState = () => {
    createRequestMutation.reset()
  }

  return {
    createRequest,
    isSavingRequest: createRequestMutation.isPending,
    resetMutationState,
  }
}
