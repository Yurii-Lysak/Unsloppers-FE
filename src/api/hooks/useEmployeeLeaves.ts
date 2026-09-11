import { useQuery } from '@tanstack/react-query'
import { employeeProfileApiService } from '@/api/services/employee-profile.service'

export const employeeLeavesQueryKey = (employeeId: string) =>
  ['employees', employeeId, 'leaves'] as const

export const useEmployeeLeaves = (employeeId: string, enabled: boolean) =>
  useQuery({
    queryKey: employeeLeavesQueryKey(employeeId),
    queryFn: () => employeeProfileApiService.getEmployeeLeaves(employeeId),
    enabled: Boolean(employeeId) && enabled,
  })
