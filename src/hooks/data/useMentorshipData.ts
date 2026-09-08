import {
  useAssignableMentees,
  useWillingMentors,
} from '@/api/hooks/useMentorship'
import { usePatchOpenToMentoring, useCreateMentorshipPair } from '@/api/hooks/useMentorshipMutations'
import type { PatchOpenToMentoringPayload } from '@/types/employee-profile'
import type { CreateMentorshipPairInput } from '@/types/mentorship'

export {
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

  return {
    willingMentors: willingMentorsData?.mentors ?? [],
    assignableMentees: assignableMenteesData?.mentees ?? [],
    isMentorsLoading,
    isMenteesLoading,
    isMentorsError,
    isMenteesError,
  }
}

export const useMentorshipHubMutations = () => {
  const createPairMutation = useCreateMentorshipPair()

  const createPair = async (input: CreateMentorshipPairInput) => {
    await createPairMutation.mutateAsync(input)
  }

  const resetMutationState = () => {
    createPairMutation.reset()
  }

  return {
    createPair,
    isAssigningPair: createPairMutation.isPending,
    resetMutationState,
  }
}
