import {
  useResourcingAssignedRequestsList,
  useResourcingPendingReviewRequestsList,
  useResourcingRequestDetail,
  useResourcingRequestsList,
} from '@/api/hooks/useResourcing'
import {
  useCreateResourcingProposal,
  useCreateResourcingRequest,
  useDecideResourcingProposal,
  useSubmitResourcingRequest,
} from '@/api/hooks/useResourcingMutations'
import { useCreateSharedLinkForCandidate } from '@/api/hooks/useSharedLinks'
import type { SectionId } from '@/types/employee-profile'
import type {
  CreateResourcingProposalInput,
  CreateResourcingRequestInput,
  DecideResourcingProposalInput,
} from '@/types/resourcing'

export { resourcingListQueryKey } from '@/api/hooks/useResourcing'

/**
 * Story 6.2 (CAP-6/AD-11) — auto-generated shared link for each internal
 * candidate on submit, scoped to CV+certs per the spec's Design Notes.
 * Never S2/S3/S7/S8.
 */
const INTERNAL_CANDIDATE_SHARED_LINK_SECTIONS: SectionId[] = ['S1', 'S4', 'S11', 'S12', 'S5']

/**
 * Story 6.3 fix (6.2 shipped defect) — the DTO's hard max, so the
 * auto-generated link plausibly survives to review time (the closest
 * available stand-in for "until the request is decided").
 */
const INTERNAL_CANDIDATE_SHARED_LINK_EXPIRY_HOURS = 168

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

export const useResourcingAssignedListData = (enabled = true) => {
  const {
    data: assignedList,
    isLoading: isAssignedLoading,
    isError: isAssignedError,
  } = useResourcingAssignedRequestsList(enabled)

  return {
    assignedList,
    isAssignedLoading,
    isAssignedError,
  }
}

export const useResourcingPendingReviewListData = (enabled = true) => {
  const {
    data: pendingReviewList,
    isLoading: isPendingReviewLoading,
    isError: isPendingReviewError,
  } = useResourcingPendingReviewRequestsList(enabled)

  return {
    pendingReviewList,
    isPendingReviewLoading,
    isPendingReviewError,
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

/**
 * Story 6.2 — fulfilment surface for one resourcing request: detail read,
 * candidate attach (internal/external), and submit. Submit orchestrates one
 * shared-link create call per internal proposal sequentially (AD-11 — no
 * backend contract spans resourcing + shared links).
 */
export const useResourcingFulfilData = (requestId: string, enabled = true) => {
  const {
    data: requestDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useResourcingRequestDetail(requestId, enabled)

  const createProposalMutation = useCreateResourcingProposal(requestId)
  const submitMutation = useSubmitResourcingRequest(requestId)
  const createSharedLinkMutation = useCreateSharedLinkForCandidate()

  const createProposal = async (input: CreateResourcingProposalInput) => {
    await createProposalMutation.mutateAsync(input)
  }

  const submitRequest = async () => {
    const submitted = await submitMutation.mutateAsync()
    const reviewingDmId = submitted.reviewingDmId
    if (!reviewingDmId) {
      return submitted
    }

    const internalCandidateIds = submitted.proposals
      .map(proposal => proposal.candidateEmployeeId)
      .filter((id): id is string => Boolean(id))

    for (const candidateEmployeeId of internalCandidateIds) {
      await createSharedLinkMutation.mutateAsync({
        employeeId: candidateEmployeeId,
        body: {
          recipientEmployeeId: reviewingDmId,
          sections: INTERNAL_CANDIDATE_SHARED_LINK_SECTIONS,
          expiresInHours: INTERNAL_CANDIDATE_SHARED_LINK_EXPIRY_HOURS,
        },
      })
    }

    return submitted
  }

  const decideMutation = useDecideResourcingProposal(requestId)

  const decideProposal = async (
    proposalId: string,
    input: DecideResourcingProposalInput,
    candidateEmployeeId?: string | null,
  ) => {
    await decideMutation.mutateAsync({
      proposalId,
      input,
      candidateEmployeeId,
    })
  }

  return {
    requestDetail,
    isDetailLoading,
    isDetailError,
    createProposal,
    isCreatingProposal: createProposalMutation.isPending,
    resetProposalMutationState: createProposalMutation.reset,
    submitRequest,
    isSubmitting: submitMutation.isPending || createSharedLinkMutation.isPending,
    decideProposal,
    isDeciding: decideMutation.isPending,
  }
}
