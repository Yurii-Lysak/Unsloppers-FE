import { apiClient } from '@/api/client'
import type { ManagementNote, ManagementNotesSection } from '@/types/employee-profile'

export interface CreateManagementNotePayload {
  content: string
  visibleForEmployee?: boolean
  visibleForPm?: boolean
}

export interface UpdateManagementNotePayload {
  content?: string
  visibleForEmployee?: boolean
  visibleForPm?: boolean
}

export const listManagementNotesApiCall = (employeeId: string) =>
  apiClient.get<ManagementNotesSection>(
    `/api/v1/employees/${employeeId}/management-notes`,
  )

export const createManagementNoteApiCall = (
  employeeId: string,
  payload: CreateManagementNotePayload,
) =>
  apiClient.post<ManagementNote>(
    `/api/v1/employees/${employeeId}/management-notes`,
    payload,
  )

export const updateManagementNoteApiCall = (
  employeeId: string,
  noteId: string,
  payload: UpdateManagementNotePayload,
) =>
  apiClient.patch<ManagementNote>(
    `/api/v1/employees/${employeeId}/management-notes/${noteId}`,
    payload,
  )

export const deleteManagementNoteApiCall = (employeeId: string, noteId: string) =>
  apiClient.delete(`/api/v1/employees/${employeeId}/management-notes/${noteId}`)
