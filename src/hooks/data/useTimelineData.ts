import {
  useCreateTimelineEvent,
  useDeleteTimelineEvent,
  useUpdateTimelineEvent,
} from '@/api/hooks/useTimeline'
import type {
  CreateTimelineEventPayload,
  UpdateTimelineEventPayload,
} from '@/types/employee-profile'

export const useTimelineData = (employeeId: string) => {
  const createEventMutation = useCreateTimelineEvent(employeeId)
  const updateEventMutation = useUpdateTimelineEvent(employeeId)
  const deleteEventMutation = useDeleteTimelineEvent(employeeId)

  const createTimelineEvent = async (payload: CreateTimelineEventPayload) => {
    await createEventMutation.mutateAsync(payload)
  }

  const updateTimelineEvent = async (
    eventId: string,
    payload: UpdateTimelineEventPayload,
  ) => {
    await updateEventMutation.mutateAsync({ eventId, payload })
  }

  const deleteTimelineEvent = async (eventId: string) => {
    await deleteEventMutation.mutateAsync(eventId)
  }

  return {
    createTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    isCreatingTimelineEvent: createEventMutation.isPending,
    isUpdatingTimelineEvent: updateEventMutation.isPending,
    isDeletingTimelineEvent: deleteEventMutation.isPending,
  }
}
