import { apiClient } from '@/api/client'
import type {
  AuthoredActionItem,
  DashboardConfigResponse,
  DashboardSummaryResponse,
} from '@/types/dashboard'

class DashboardApiService {
  public getConfig(): Promise<DashboardConfigResponse> {
    return apiClient.get<DashboardConfigResponse>('/api/v1/dashboards/config')
  }

  public getSummary(): Promise<DashboardSummaryResponse> {
    return apiClient.get<DashboardSummaryResponse>('/api/v1/dashboards/summary')
  }

  public getAuthoredActionItems(): Promise<AuthoredActionItem[]> {
    return apiClient.get<AuthoredActionItem[]>('/api/v1/me/authored-action-items')
  }
}

export const dashboardApiService = new DashboardApiService()
