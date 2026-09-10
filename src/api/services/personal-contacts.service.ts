import { apiClient } from '@/api/client'
import type {
  CreateContactMethodPayload,
  CreateEmergencyContactPayload,
  EmergencyContact,
  PersonalContactMethod,
  PersonalContactsSection,
  PatchAddressPayload,
  UpdateContactMethodPayload,
  UpdateEmergencyContactPayload,
} from '@/types/employee-profile'

class PersonalContactsApiService {
  public createContactMethod(
    employeeId: string,
    payload: CreateContactMethodPayload,
  ): Promise<PersonalContactMethod> {
    return apiClient.post<PersonalContactMethod>(
      `/api/v1/employees/${employeeId}/personal-contacts`,
      payload,
    )
  }

  public updateContactMethod(
    employeeId: string,
    contactId: string,
    payload: UpdateContactMethodPayload,
  ): Promise<PersonalContactMethod> {
    return apiClient.patch<PersonalContactMethod>(
      `/api/v1/employees/${employeeId}/personal-contacts/${contactId}`,
      payload,
    )
  }

  public deleteContactMethod(employeeId: string, contactId: string): Promise<void> {
    return apiClient.delete<void>(
      `/api/v1/employees/${employeeId}/personal-contacts/${contactId}`,
    )
  }

  public patchAddress(
    employeeId: string,
    payload: PatchAddressPayload,
  ): Promise<PersonalContactsSection> {
    return apiClient.patch<PersonalContactsSection>(
      `/api/v1/employees/${employeeId}/personal-contacts/address`,
      payload,
    )
  }

  public createEmergencyContact(
    employeeId: string,
    payload: CreateEmergencyContactPayload,
  ): Promise<EmergencyContact> {
    return apiClient.post<EmergencyContact>(
      `/api/v1/employees/${employeeId}/emergency-contacts`,
      payload,
    )
  }

  public updateEmergencyContact(
    employeeId: string,
    emergencyContactId: string,
    payload: UpdateEmergencyContactPayload,
  ): Promise<EmergencyContact> {
    return apiClient.patch<EmergencyContact>(
      `/api/v1/employees/${employeeId}/emergency-contacts/${emergencyContactId}`,
      payload,
    )
  }

  public deleteEmergencyContact(
    employeeId: string,
    emergencyContactId: string,
  ): Promise<void> {
    return apiClient.delete<void>(
      `/api/v1/employees/${employeeId}/emergency-contacts/${emergencyContactId}`,
    )
  }
}

export const personalContactsApiService = new PersonalContactsApiService()
