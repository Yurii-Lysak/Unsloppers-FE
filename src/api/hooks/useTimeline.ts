import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeProfileQueryKey } from '@/api/hooks/useEmployeeProfile'
import { timelineApiService } from '@/api/services/timeline.service'
import type {
  CreateTimelineEventPayload,
  UpdateTimelineEventPayload,
} from '@/types/employee-profile'

export const useCreateTimelineEvent = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTimelineEventPayload) =>
      timelineApiService.createEvent(employeeId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s9.create.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s9.create.error'))
    },
  })
}

export const useUpdateTimelineEvent = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      eventId,
      payload,
    }: {
      eventId: string
      payload: UpdateTimelineEventPayload
    }) => timelineApiService.updateEvent(employeeId, eventId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s9.update.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s9.update.error'))
    },
  })
}

export const useDeleteTimelineEvent = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: string) =>
      timelineApiService.deleteEvent(employeeId, eventId),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s9.delete.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s9.delete.error'))
    },
  })
}
