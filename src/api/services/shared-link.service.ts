import { apiClient } from '@/api/client'
import type { SectionId } from '@/types/employee-profile'
import type { EmployeeProfile } from '@/types/employee-profile'

export interface CreateSharedLinkRequest {
  recipientEmployeeId: string
  sections?: SectionId[]
}

export interface CreateSharedLinkResponse {
  token: string
  url: string
}

class SharedLinkApiService {
  public createSharedLink(
    employeeId: string,
    body: CreateSharedLinkRequest,
  ): Promise<CreateSharedLinkResponse> {
    return apiClient.post<CreateSharedLinkResponse>(
      `/api/v1/employees/${employeeId}/shared-links`,
      body,
    )
  }

  public getSharedLinkProfile(token: string): Promise<EmployeeProfile> {
    return apiClient.get<EmployeeProfile>(`/api/v1/shared-links/${token}/profile`)
  }
}

export const sharedLinkApiService = new SharedLinkApiService()
