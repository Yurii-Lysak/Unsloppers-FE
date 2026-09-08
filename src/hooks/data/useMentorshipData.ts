import { usePatchOpenToMentoring } from '@/api/hooks/useMentorshipMutations'
import type { PatchOpenToMentoringPayload } from '@/types/employee-profile'

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
