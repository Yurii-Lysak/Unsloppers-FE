import { useQuery } from '@tanstack/react-query'
import { employeeProfileApiService } from '@/api/services/employee-profile.service'

export const employeeProfileQueryKey = (employeeId: string) =>
  ['employees', employeeId, 'profile'] as const

export const useEmployeeProfile = (employeeId: string) =>
  useQuery({
    queryKey: employeeProfileQueryKey(employeeId),
    queryFn: () => employeeProfileApiService.getEmployeeProfile(employeeId),
    enabled: Boolean(employeeId),
  })
