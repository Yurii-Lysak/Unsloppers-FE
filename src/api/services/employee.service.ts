import { apiClient } from '@/api/client'
import type {
  EmployeeFieldUpdate,
  EmployeeListQuery,
  EmployeeListResponse,
  EmployeeLookupOption,
  EmployeeSummary,
  FieldValue,
} from '@/types/employees'
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

  public getEmployeeLookup(): Promise<EmployeeLookupOption[]> {
    return apiClient.get<EmployeeLookupOption[]>('/api/v1/employees/lookup')
  }

  public getEmployeeFunctionalRoles(employeeId: string): Promise<FunctionalRole[]> {
    return apiClient.get<FunctionalRole[]>(`/api/v1/employees/${employeeId}/functional-roles`)
  }

  public setEmployeeFunctionalRoles(employeeId: string, roleIds: string[]): Promise<FunctionalRole[]> {
    return apiClient.put<FunctionalRole[]>(`/api/v1/employees/${employeeId}/functional-roles`, {
      roleIds,
    })
  }

  public updateEmployeeField(
    employeeId: string,
    fieldId: string,
    value: FieldValue,
  ): Promise<EmployeeFieldUpdate> {
    return apiClient.patch<EmployeeFieldUpdate>(
      `/api/v1/employees/${employeeId}/fields/${fieldId}`,
      { value },
    )
  }
}

export const employeeApiService = new EmployeeApiService()
