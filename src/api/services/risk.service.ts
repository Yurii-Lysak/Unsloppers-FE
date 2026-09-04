import { apiClient } from '@/api/client'
import type {
  CreateRiskRecordPayload,
  RiskRecord,
  RisksSection,
} from '@/types/employee-profile'

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
}

export const riskApiService = new RiskApiService()
