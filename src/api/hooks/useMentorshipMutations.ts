import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  assignableMenteesQueryKey,
  willingMentorsQueryKey,
} from '@/api/hooks/useMentorship'
import { employeeProfileQueryKey } from '@/api/hooks/useEmployeeProfile'
import { mentorshipApiService } from '@/api/services/mentorship.service'
import type { PatchOpenToMentoringPayload } from '@/types/employee-profile'
import type { CreateMentorshipPairInput } from '@/types/mentorship'

export const usePatchOpenToMentoring = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PatchOpenToMentoringPayload) =>
      mentorshipApiService.patchOpenToMentoring(employeeId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s13.update.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s13.update.error'))
    },
  })
}

export const useCreateMentorshipPair = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateMentorshipPairInput) =>
      mentorshipApiService.createPair(input),
    onSuccess: async (_data, variables) => {
      toast.success(t('mentorshipHub.assign.success'))
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: willingMentorsQueryKey }),
        queryClient.invalidateQueries({ queryKey: assignableMenteesQueryKey }),
        queryClient.invalidateQueries({
          queryKey: employeeProfileQueryKey(variables.mentorId),
        }),
        queryClient.invalidateQueries({
          queryKey: employeeProfileQueryKey(variables.menteeId),
        }),
      ])
    },
    onError: () => {
      toast.error(t('mentorshipHub.assign.error'))
    },
  })
}
