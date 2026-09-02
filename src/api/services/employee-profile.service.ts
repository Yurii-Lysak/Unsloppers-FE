import { apiClient } from '@/api/client'
import type { EmployeeProfile } from '@/types/employee-profile'

class EmployeeProfileApiService {
  public getEmployeeProfile(employeeId: string): Promise<EmployeeProfile> {
    return apiClient.get<EmployeeProfile>(`/api/v1/employees/${employeeId}/profile`)
  }
}

export const employeeProfileApiService = new EmployeeProfileApiService()
