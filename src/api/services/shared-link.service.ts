import { apiClient } from '@/api/client'
import type { SectionId } from '@/types/employee-profile'
import type { EmployeeProfile } from '@/types/employee-profile'

export interface CreateSharedLinkRequest {
  recipientEmployeeId: string
  sections?: SectionId[]
  expiresInHours?: number
}

export interface CreateSharedLinkResponse {
  token: string
  url: string
}

export interface SharedLinkPerson {
  id: string
  displayName: string
}

export interface SharedLinkSummary {
  id: string
  recipient: SharedLinkPerson
  creator: SharedLinkPerson
  expiresAt: string
  createdAt: string
  sectionIds: SectionId[]
}

export interface SharedLinkAccessLogEntry {
  accessedAt: string
  outcome: 'granted' | 'denied'
  denialReason?: 'expired' | 'revoked' | 'wrong_recipient'
  originIp: string | null
  recipientEmployeeId: string | null
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

  public listSharedLinks(employeeId: string): Promise<{ links: SharedLinkSummary[] }> {
    return apiClient.get<{ links: SharedLinkSummary[] }>(
      `/api/v1/employees/${employeeId}/shared-links`,
    )
  }

  public revokeSharedLink(
    employeeId: string,
    linkId: string,
  ): Promise<{ revoked: boolean }> {
    return apiClient.post<{ revoked: boolean }>(
      `/api/v1/employees/${employeeId}/shared-links/${linkId}/revoke`,
    )
  }

  public getSharedLinkAccessLog(
    employeeId: string,
    linkId: string,
  ): Promise<{ entries: SharedLinkAccessLogEntry[] }> {
    return apiClient.get<{ entries: SharedLinkAccessLogEntry[] }>(
      `/api/v1/employees/${employeeId}/shared-links/${linkId}/access-log`,
    )
  }

  public getSharedLinkProfile(token: string): Promise<EmployeeProfile> {
    return apiClient.get<EmployeeProfile>(`/api/v1/shared-links/${token}/profile`)
  }
}

export const sharedLinkApiService = new SharedLinkApiService()
