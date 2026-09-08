import {
  useCreateFeedback,
  useDeleteFeedback,
  useUpdateFeedback,
} from '@/api/hooks/useFeedbackMutations'
import type {
  CreateFeedbackRecordPayload,
  UpdateFeedbackRecordPayload,
} from '@/types/employee-profile'

export const useFeedbackData = (employeeId: string) => {
  const createFeedbackMutation = useCreateFeedback(employeeId)
  const updateFeedbackMutation = useUpdateFeedback(employeeId)
  const deleteFeedbackMutation = useDeleteFeedback(employeeId)

  const createFeedback = async (payload: CreateFeedbackRecordPayload) => {
    await createFeedbackMutation.mutateAsync(payload)
  }

  const updateFeedback = async (
    feedbackId: string,
    payload: UpdateFeedbackRecordPayload,
  ) => {
    await updateFeedbackMutation.mutateAsync({ feedbackId, payload })
  }

  const deleteFeedback = async (feedbackId: string) => {
    await deleteFeedbackMutation.mutateAsync(feedbackId)
  }

  return {
    createFeedback,
    updateFeedback,
    deleteFeedback,
    isCreatingFeedback: createFeedbackMutation.isPending,
    isUpdatingFeedback: updateFeedbackMutation.isPending,
    isDeletingFeedback: deleteFeedbackMutation.isPending,
    isMutatingFeedback:
      createFeedbackMutation.isPending ||
      updateFeedbackMutation.isPending ||
      deleteFeedbackMutation.isPending,
  }
}
