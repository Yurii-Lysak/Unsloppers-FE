import { apiClient } from '@/api/client'
import type { EmployeeListQuery, EmployeeListResponse, EmployeeSummary } from '@/types/employees'
import type { FunctionalRole } from '@/types/functional-roles'

class EmployeeApiService {
  public getEmployeesList(query: EmployeeListQuery): Promise<EmployeeListResponse> {
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

  public getEmployee(employeeId: string): Promise<EmployeeSummary> {
    return apiClient.get<EmployeeSummary>(`/api/v1/employees/${employeeId}`)
  }

  public getEmployeeFunctionalRoles(employeeId: string): Promise<FunctionalRole[]> {
    return apiClient.get<FunctionalRole[]>(`/api/v1/employees/${employeeId}/functional-roles`)
  }

  public setEmployeeFunctionalRoles(employeeId: string, roleIds: string[]): Promise<FunctionalRole[]> {
    return apiClient.put<FunctionalRole[]>(`/api/v1/employees/${employeeId}/functional-roles`, {
      roleIds,
    })
  }
}

export const employeeApiService = new EmployeeApiService()
