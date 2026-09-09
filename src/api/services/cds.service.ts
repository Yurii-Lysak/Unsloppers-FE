import { apiClient } from '@/api/client'
import type {
  CreateIdpRecordPayload,
  IdpRecord,
  UpdateIdpRecordPayload,
} from '@/types/employee-profile'

class CdsApiService {
  public createIdpRecord(
    employeeId: string,
    payload: CreateIdpRecordPayload,
  ): Promise<IdpRecord> {
    return apiClient.post<IdpRecord>(
      `/api/v1/employees/${employeeId}/idp-records`,
      payload,
    )
  }

  public updateIdpRecord(
    employeeId: string,
    idpId: string,
    payload: UpdateIdpRecordPayload,
  ): Promise<IdpRecord> {
    return apiClient.patch<IdpRecord>(
      `/api/v1/employees/${employeeId}/idp-records/${idpId}`,
      payload,
    )
  }

  public completeIdpRecord(employeeId: string, idpId: string): Promise<IdpRecord> {
    return apiClient.post<IdpRecord>(
      `/api/v1/employees/${employeeId}/idp-records/${idpId}/complete`,
    )
  }
}

export const cdsApiService = new CdsApiService()
