import { apiClient } from '@/api/client'
import type { DocumentRecord, DocumentType } from '@/types/employee-profile'

class DocumentsApiService {
  public uploadDocument(
    employeeId: string,
    type: DocumentType,
    file: File,
  ): Promise<DocumentRecord> {
    const formData = new FormData()
    formData.append('type', type)
    formData.append('file', file)

    return apiClient.post<DocumentRecord>(
      `/api/v1/employees/${employeeId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  }
}

export const documentsApiService = new DocumentsApiService()
