import {
  useCreateManagementNote,
  useDeleteManagementNote,
  useUpdateManagementNote,
} from '@/api/hooks/useManagementNotesMutations'
import type {
  CreateManagementNotePayload,
  UpdateManagementNotePayload,
} from '@/types/employee-profile'

export const useManagementNotesData = (employeeId: string) => {
  const createNoteMutation = useCreateManagementNote(employeeId)
  const updateNoteMutation = useUpdateManagementNote(employeeId)
  const deleteNoteMutation = useDeleteManagementNote(employeeId)

  const createNote = async (payload: CreateManagementNotePayload) => {
    await createNoteMutation.mutateAsync(payload)
  }

  const updateNote = async (
    noteId: string,
    payload: UpdateManagementNotePayload,
  ) => {
    await updateNoteMutation.mutateAsync({ noteId, payload })
  }

  const deleteNote = async (noteId: string) => {
    await deleteNoteMutation.mutateAsync(noteId)
  }

  return {
    createNote,
    updateNote,
    deleteNote,
    isCreatingNote: createNoteMutation.isPending,
    isUpdatingNote: updateNoteMutation.isPending,
    isDeletingNote: deleteNoteMutation.isPending,
    isMutatingNote:
      createNoteMutation.isPending ||
      updateNoteMutation.isPending ||
      deleteNoteMutation.isPending,
  }
}
