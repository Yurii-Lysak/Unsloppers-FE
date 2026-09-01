import { apiClient } from '@/api/client'
import type {
  AccessRole,
  EmployeeProfile,
  SectionAccessLevel,
  SectionId,
} from '@/types/employee-profile'

export const employeeProfileQueryKey = (employeeId: string) =>
  ['employees', employeeId, 'profile'] as const

export const getEmployeeProfileApiCall = (employeeId: string) =>
  apiClient.get<EmployeeProfile>(`/api/v1/employees/${employeeId}/profile`)

export type { AccessRole, EmployeeProfile, SectionAccessLevel, SectionId }
