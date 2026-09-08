import {
  useAssignableMentees,
  useActiveMentorshipPairs,
  useWillingMentors,
} from '@/api/hooks/useMentorship'
import { usePatchOpenToMentoring, useCreateMentorshipPair, useEndMentorshipPair } from '@/api/hooks/useMentorshipMutations'
import type { PatchOpenToMentoringPayload } from '@/types/employee-profile'
import type { CreateMentorshipPairInput, EndMentorshipPairInput } from '@/types/mentorship'

export {
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

export const useMentorshipHubData = (enabled = true) => {
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
    data: activePairsData,
    isLoading: isActivePairsLoading,
    isError: isActivePairsError,
  } = useActiveMentorshipPairs(enabled)

  return {
    willingMentors: willingMentorsData?.mentors ?? [],
    assignableMentees: assignableMenteesData?.mentees ?? [],
    activePairs: activePairsData?.pairs ?? [],
    isMentorsLoading,
    isMenteesLoading,
    isActivePairsLoading,
    isMentorsError,
    isMenteesError,
    isActivePairsError,
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
