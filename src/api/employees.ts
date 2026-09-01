import { apiClient } from '@/api/client'
import type { EmployeeListQuery, EmployeeListResponse } from '@/types/employees'

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
