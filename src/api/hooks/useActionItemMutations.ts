import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeProfileQueryKey } from '@/api/hooks/useEmployeeProfile'
import { actionItemApiService } from '@/api/services/action-item.service'

export const useCompleteActionItem = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) =>
      actionItemApiService.completeActionItem(employeeId, itemId),
    onSuccess: async () => {
      toast.success(t('employeeProfile.actionItems.complete.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: async error => {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 409 &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'status' in error.response.data
      ) {
        const status = (error.response.data as { status?: string }).status
        if (status === 'completed') {
          toast.error(t('employeeProfile.actionItems.complete.error.completed'))
        } else if (status === 'cancelled') {
          toast.error(t('employeeProfile.actionItems.complete.error.cancelled'))
        } else {
          toast.error(t('employeeProfile.actionItems.complete.error.generic'))
        }
      } else {
        toast.error(t('employeeProfile.actionItems.complete.error.generic'))
      }
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
  })
}
