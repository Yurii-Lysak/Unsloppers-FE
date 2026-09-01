import { useQuery } from '@tanstack/react-query'
import { getEmployeeApiCall } from '@/api/employees'

export const employeeDetailQueryKey = (employeeId: string) =>
  ['employees', employeeId] as const

export const useEmployeeDetail = (employeeId: string) =>
  useQuery({
    queryKey: employeeDetailQueryKey(employeeId),
    queryFn: () => getEmployeeApiCall(employeeId),
    enabled: Boolean(employeeId),
  })
