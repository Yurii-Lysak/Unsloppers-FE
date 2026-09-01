import { apiClient } from '@/api/client'
import type { EmployeeListQuery, EmployeeListResponse } from '@/types/employees'
import type { FunctionalRole } from '@/types/functional-roles'

export const listEmployeesApiCall = (query: EmployeeListQuery) => {
  const params: Record<string, string | number | undefined> = {
    page: query.page,
    pageSize: query.pageSize,
    sort: query.sort,
    order: query.order,
  }

  if (query.filters && query.filters.length > 0) {
    params.filters = JSON.stringify(query.filters)
  }

  return apiClient.get<EmployeeListResponse>('/api/v1/employees', { params })
}

export interface EmployeeSummary {
  id: string
  displayName: string
}

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
