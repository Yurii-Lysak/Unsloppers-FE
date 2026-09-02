import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeProfileQueryKey } from '@/api/hooks/useEmployeeProfile'
import { managementNoteApiService } from '@/api/services/management-note.service'
import type {
  CreateManagementNotePayload,
  UpdateManagementNotePayload,
} from '@/types/employee-profile'

export const useCreateManagementNote = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateManagementNotePayload) =>
      managementNoteApiService.createManagementNote(employeeId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.managementNotes.create.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.managementNotes.create.error'))
    },
  })
}

export const useUpdateManagementNote = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      noteId,
      payload,
    }: {
      noteId: string
      payload: UpdateManagementNotePayload
    }) => managementNoteApiService.updateManagementNote(employeeId, noteId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.managementNotes.update.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.managementNotes.update.error'))
    },
  })
}

export const useDeleteManagementNote = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (noteId: string) =>
      managementNoteApiService.deleteManagementNote(employeeId, noteId),
    onSuccess: async () => {
      toast.success(t('employeeProfile.managementNotes.delete.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.managementNotes.delete.error'))
    },
  })
}
