import { apiClient } from '@/api/client'
import type {
  CreateRiskRecordPayload,
  RiskRecord,
  RisksSection,
} from '@/types/employee-profile'
import type {
  RiskDashboardAccessResponse,
  RiskDashboardQuery,
  RiskDashboardResponse,
} from '@/types/risk-dashboard'

class RiskApiService {
  public getRisks(employeeId: string): Promise<RisksSection> {
    return apiClient.get<RisksSection>(`/api/v1/employees/${employeeId}/risks`)
  }

  public createRiskRecord(
    employeeId: string,
    payload: CreateRiskRecordPayload,
  ): Promise<RiskRecord> {
    return apiClient.post<RiskRecord>(
      `/api/v1/employees/${employeeId}/risks`,
      payload,
    )
  }

  public getDashboardAccess(): Promise<RiskDashboardAccessResponse> {
    return apiClient.get<RiskDashboardAccessResponse>(
      '/api/v1/risks/dashboard/access',
    )
  }

  public getDashboard(query: RiskDashboardQuery = {}): Promise<RiskDashboardResponse> {
    return apiClient.get<RiskDashboardResponse>('/api/v1/risks/dashboard', {
      params: query,
    })
  }
}

export const riskApiService = new RiskApiService()
