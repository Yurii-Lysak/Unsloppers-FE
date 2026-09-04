import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeProfileQueryKey } from '@/api/hooks/useEmployeeProfile'
import { riskApiService } from '@/api/services/risk.service'
import type { CreateRiskRecordPayload } from '@/types/employee-profile'

export const useCreateRiskRecord = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateRiskRecordPayload) =>
      riskApiService.createRiskRecord(employeeId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.risks.create.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.risks.create.error'))
    },
  })
}
