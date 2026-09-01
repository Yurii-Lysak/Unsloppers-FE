import { apiClient } from '@/api/client'
import type { FunctionalRole } from '@/types/functional-roles'

export interface EmployeeSummary {
  id: string
  displayName: string
}

export const listEmployeesApiCall = () =>
  apiClient.get<EmployeeSummary[]>('/api/v1/employees')

export const getEmployeeApiCall = (employeeId: string) =>
  apiClient.get<EmployeeSummary>(`/api/v1/employees/${employeeId}`)

export const getEmployeeFunctionalRolesApiCall = (employeeId: string) =>
  apiClient.get<FunctionalRole[]>(`/api/v1/employees/${employeeId}/functional-roles`)

export const setEmployeeFunctionalRolesApiCall = (
  employeeId: string,
  roleIds: string[],
) =>
  apiClient.put<FunctionalRole[]>(`/api/v1/employees/${employeeId}/functional-roles`, {
    roleIds,
  })
