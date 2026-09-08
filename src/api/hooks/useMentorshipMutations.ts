import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeProfileQueryKey } from '@/api/hooks/useEmployeeProfile'
import { mentorshipApiService } from '@/api/services/mentorship.service'
import type { PatchOpenToMentoringPayload } from '@/types/employee-profile'

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
