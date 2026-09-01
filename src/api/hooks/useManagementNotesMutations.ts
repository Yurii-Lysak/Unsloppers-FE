import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createManagementNoteApiCall,
  deleteManagementNoteApiCall,
  updateManagementNoteApiCall,
  type CreateManagementNotePayload,
  type UpdateManagementNotePayload,
} from '@/api/management-notes'
import { employeeProfileQueryKey } from '@/api/employee-profile'

export const useCreateManagementNote = (employeeId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateManagementNotePayload) =>
      createManagementNoteApiCall(employeeId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
  })
}

export const useUpdateManagementNote = (employeeId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      noteId,
      payload,
    }: {
      noteId: string
      payload: UpdateManagementNotePayload
    }) => updateManagementNoteApiCall(employeeId, noteId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
  })
}

export const useDeleteManagementNote = (employeeId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (noteId: string) =>
      deleteManagementNoteApiCall(employeeId, noteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
  })
}
