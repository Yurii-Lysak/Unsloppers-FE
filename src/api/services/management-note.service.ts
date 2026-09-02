import { apiClient } from '@/api/client'
import type {
  CreateManagementNotePayload,
  ManagementNote,
  ManagementNotesSection,
  UpdateManagementNotePayload,
} from '@/types/employee-profile'

class ManagementNoteApiService {
  public getManagementNotes(employeeId: string): Promise<ManagementNotesSection> {
    return apiClient.get<ManagementNotesSection>(
      `/api/v1/employees/${employeeId}/management-notes`,
    )
  }

  public createManagementNote(
    employeeId: string,
    payload: CreateManagementNotePayload,
  ): Promise<ManagementNote> {
    return apiClient.post<ManagementNote>(
      `/api/v1/employees/${employeeId}/management-notes`,
      payload,
    )
  }

  public updateManagementNote(
    employeeId: string,
    noteId: string,
    payload: UpdateManagementNotePayload,
  ): Promise<ManagementNote> {
    return apiClient.patch<ManagementNote>(
      `/api/v1/employees/${employeeId}/management-notes/${noteId}`,
      payload,
    )
  }

  public deleteManagementNote(employeeId: string, noteId: string): Promise<void> {
    return apiClient.delete<void>(
      `/api/v1/employees/${employeeId}/management-notes/${noteId}`,
    )
  }
}

export const managementNoteApiService = new ManagementNoteApiService()
