import { apiClient } from '@/api/client'

class IdentityApiService {
  public uploadPhoto(
    employeeId: string,
    file: File,
  ): Promise<{ photoUrl: string }> {
    const formData = new FormData()
    formData.append('photo', file)

    return apiClient.post<{ photoUrl: string }>(
      `/api/v1/employees/${employeeId}/identity/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
  }
}

export const identityApiService = new IdentityApiService()
