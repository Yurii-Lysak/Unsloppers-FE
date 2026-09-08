import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeProfileQueryKey } from '@/api/hooks/useEmployeeProfile'
import { feedbackApiService } from '@/api/services/feedback.service'
import type {
  CreateFeedbackRecordPayload,
  UpdateFeedbackRecordPayload,
} from '@/types/employee-profile'

export const useCreateFeedback = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateFeedbackRecordPayload) =>
      feedbackApiService.createFeedback(employeeId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.feedback.create.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.feedback.create.error'))
    },
  })
}

export const useUpdateFeedback = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      feedbackId,
      payload,
    }: {
      feedbackId: string
      payload: UpdateFeedbackRecordPayload
    }) => feedbackApiService.updateFeedback(employeeId, feedbackId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.feedback.update.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.feedback.update.error'))
    },
  })
}

export const useDeleteFeedback = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (feedbackId: string) =>
      feedbackApiService.deleteFeedback(employeeId, feedbackId),
    onSuccess: async () => {
      toast.success(t('employeeProfile.feedback.delete.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.feedback.delete.error'))
    },
  })
}
