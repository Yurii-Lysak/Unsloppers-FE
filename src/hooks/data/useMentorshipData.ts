import {
  useAssignableMentees,
  useMentorshipPairs,
  useWillingMentors,
} from '@/api/hooks/useMentorship'
import { usePatchOpenToMentoring, useCreateMentorshipPair, useEndMentorshipPair } from '@/api/hooks/useMentorshipMutations'
import type { PatchOpenToMentoringPayload } from '@/types/employee-profile'
import type { CreateMentorshipPairInput, EndMentorshipPairInput, MentorshipPairListFilter } from '@/types/mentorship'

export {
  mentorshipPairsQueryKey,
  activeMentorshipPairsQueryKey,
  assignableMenteesQueryKey,
  willingMentorsQueryKey,
} from '@/api/hooks/useMentorship'

export const useMentorshipData = (employeeId: string) => {
  const patchOpenToMentoringMutation = usePatchOpenToMentoring(employeeId)

  const patchOpenToMentoring = async (payload: PatchOpenToMentoringPayload) => {
    await patchOpenToMentoringMutation.mutateAsync(payload)
  }

  return {
    patchOpenToMentoring,
    isPatchingOpenToMentoring: patchOpenToMentoringMutation.isPending,
  }
}

export const useMentorshipHubData = (
  pairStatus: MentorshipPairListFilter = 'all',
  enabled = true,
) => {
  const {
    data: willingMentorsData,
    isLoading: isMentorsLoading,
    isError: isMentorsError,
  } = useWillingMentors(enabled)

  const {
    data: assignableMenteesData,
    isLoading: isMenteesLoading,
    isError: isMenteesError,
  } = useAssignableMentees(enabled)

  const {
    data: pairsData,
    isLoading: isPairsLoading,
    isError: isPairsError,
  } = useMentorshipPairs(pairStatus, enabled)

  return {
    willingMentors: willingMentorsData?.mentors ?? [],
    assignableMentees: assignableMenteesData?.mentees ?? [],
    pairs: pairsData?.pairs ?? [],
    isMentorsLoading,
    isMenteesLoading,
    isPairsLoading,
    isMentorsError,
    isMenteesError,
    isPairsError,
  }
}

export const useMentorshipHubMutations = () => {
  const createPairMutation = useCreateMentorshipPair()
  const endPairMutation = useEndMentorshipPair()

  const createPair = async (input: CreateMentorshipPairInput) => {
    await createPairMutation.mutateAsync(input)
  }

  const endPair = async (input: {
    pairId: string
    mentorId: string
    menteeId: string
    input: EndMentorshipPairInput
  }) => {
    await endPairMutation.mutateAsync(input)
  }

  const resetMutationState = () => {
    createPairMutation.reset()
  }

  const resetEndMutationState = () => {
    endPairMutation.reset()
  }

  return {
    createPair,
    endPair,
    isAssigningPair: createPairMutation.isPending,
    isEndingPair: endPairMutation.isPending,
    resetMutationState,
    resetEndMutationState,
  }
}
