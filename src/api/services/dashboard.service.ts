import { apiClient } from '@/api/client'
import type {
  AuthoredActionItem,
  DashboardConfigResponse,
  DashboardSummaryResponse,
} from '@/types/dashboard'

export interface DashboardSummaryQuery {
  page?: number
  pageSize?: number
  projectId?: string
}

class DashboardApiService {
  public getConfig(): Promise<DashboardConfigResponse> {
    return apiClient.get<DashboardConfigResponse>('/api/v1/dashboards/config')
  }

  public getSummary(query: DashboardSummaryQuery = {}): Promise<DashboardSummaryResponse> {
    return apiClient.get<DashboardSummaryResponse>('/api/v1/dashboards/summary', {
      params: query,
    })
  }

  public getAuthoredActionItems(): Promise<AuthoredActionItem[]> {
    return apiClient.get<AuthoredActionItem[]>('/api/v1/me/authored-action-items')
  }
}

export const dashboardApiService = new DashboardApiService()
