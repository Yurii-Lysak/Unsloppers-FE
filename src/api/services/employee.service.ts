import { apiClient } from '@/api/client'
import type {
  EmployeeFieldUpdate,
  EmployeeLeaveCell,
  EmployeeListExportQuery,
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

  public async exportEmployeesList(query: EmployeeListExportQuery): Promise<void> {
    const params: Record<string, string | undefined> = {
      sort: query.sort,
      order: query.order,
      columns: JSON.stringify(query.columns),
    }

    if (query.filters && query.filters.length > 0) {
      params.filters = JSON.stringify(query.filters)
    }

    const response = await apiClient.raw.get<Blob>('/api/v1/employees/export', {
      params,
      responseType: 'blob',
    })

    const disposition = response.headers['content-disposition']
    const fallback = `employees-export-${new Date().toISOString().slice(0, 10)}.xlsx`
    const filenameMatch =
      typeof disposition === 'string'
        ? disposition.match(/filename="([^"]+)"/)
        : null
    const filename = filenameMatch?.[1] ?? fallback

    const url = URL.createObjectURL(response.data)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
  }

  public getEmployee(employeeId: string): Promise<EmployeeSummary> {
    return apiClient.get<EmployeeSummary>(`/api/v1/employees/${employeeId}`)
  }

  public getEmployeeLookup(): Promise<EmployeeLookupOption[]> {
    return apiClient.get<EmployeeLookupOption[]>('/api/v1/employees/lookup')
  }

  /**
   * Batched leave-dates column data (Story 3.6 list-performance follow-up):
   * the list's own response never blocks on TimeTracker — the page fetches
   * this separately, once the page's employee ids are known, and fills the
   * column in.
   */
  public getEmployeeLeaveCells(
    employeeIds: string[],
  ): Promise<Record<string, EmployeeLeaveCell>> {
    return apiClient.get<Record<string, EmployeeLeaveCell>>('/api/v1/employees/leaves', {
      params: { employeeIds: employeeIds.join(',') },
    })
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
