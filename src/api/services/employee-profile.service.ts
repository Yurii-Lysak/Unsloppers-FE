import { apiClient } from '@/api/client'
import type { EmployeeProfile, LeavesSection } from '@/types/employee-profile'

class EmployeeProfileApiService {
  public getEmployeeProfile(employeeId: string): Promise<EmployeeProfile> {
    return apiClient.get<EmployeeProfile>(`/api/v1/employees/${employeeId}/profile`)
  }

  /** Fills in the S10 section left `pending` by getEmployeeProfile (Story 3.6 follow-up). */
  public getEmployeeLeaves(employeeId: string): Promise<LeavesSection> {
    return apiClient.get<LeavesSection>(`/api/v1/employees/${employeeId}/leaves`)
  }
}

export const employeeProfileApiService = new EmployeeProfileApiService()
