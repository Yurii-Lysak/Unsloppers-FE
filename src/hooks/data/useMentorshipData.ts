import { useCallback } from 'react'
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

  // Depend on the mutation's own methods, not the mutation object itself —
  // useMutation() returns a new object every render, but mutateAsync/reset
  // are stable; depending on the object would defeat this memoization and
  // reintroduce the effect loop these callbacks exist to prevent (consumers
  // put resetMutationState/resetEndMutationState in a useEffect dep array).
  const createPair = useCallback(
    async (input: CreateMentorshipPairInput) => {
      await createPairMutation.mutateAsync(input)
    },
    [createPairMutation.mutateAsync],
  )

  const endPair = useCallback(
    async (input: {
      pairId: string
      mentorId: string
      menteeId: string
      input: EndMentorshipPairInput
    }) => {
      await endPairMutation.mutateAsync(input)
    },
    [endPairMutation.mutateAsync],
  )

  const resetMutationState = useCallback(() => {
    createPairMutation.reset()
  }, [createPairMutation.reset])

  const resetEndMutationState = useCallback(() => {
    endPairMutation.reset()
  }, [endPairMutation.reset])

  return {
    createPair,
    endPair,
    isAssigningPair: createPairMutation.isPending,
    isEndingPair: endPairMutation.isPending,
    resetMutationState,
    resetEndMutationState,
  }
}
