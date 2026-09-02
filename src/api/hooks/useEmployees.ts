import { useQuery } from '@tanstack/react-query'
import { employeeApiService } from '@/api/services/employee.service'

export const employeeDetailQueryKey = (employeeId: string) =>
  ['employees', employeeId] as const

export const useEmployeeDetail = (employeeId: string) =>
  useQuery({
    queryKey: employeeDetailQueryKey(employeeId),
    queryFn: () => employeeApiService.getEmployee(employeeId),
    enabled: Boolean(employeeId),
  })
