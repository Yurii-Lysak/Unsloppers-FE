import { apiClient } from '@/api/client'
import type {
  CdsAssessmentEntry,
  CreateCdsAssessmentPayload,
  CreateIdpRecordPayload,
  IdpRecord,
  UpdateCdsAssessmentConclusionPayload,
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

  public createAssessment(
    employeeId: string,
    payload: CreateCdsAssessmentPayload,
  ): Promise<CdsAssessmentEntry> {
    return apiClient.post<CdsAssessmentEntry>(
      `/api/v1/employees/${employeeId}/cds-assessments`,
      payload,
    )
  }

  public updateAssessmentConclusion(
    employeeId: string,
    assessmentId: string,
    payload: UpdateCdsAssessmentConclusionPayload,
  ): Promise<CdsAssessmentEntry> {
    return apiClient.patch<CdsAssessmentEntry>(
      `/api/v1/employees/${employeeId}/cds-assessments/${assessmentId}`,
      payload,
    )
  }
}

export const cdsApiService = new CdsApiService()
