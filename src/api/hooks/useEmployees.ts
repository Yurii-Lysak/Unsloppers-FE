import { useQuery } from '@tanstack/react-query'
import { getEmployeeApiCall, listEmployeesApiCall } from '@/api/employees'

export const employeesListQueryKey = ['employees', 'list'] as const

export const employeeDetailQueryKey = (employeeId: string) =>
  ['employees', employeeId] as const

export const useEmployeesList = () =>
  useQuery({
    queryKey: employeesListQueryKey,
    queryFn: listEmployeesApiCall,
  })

export const useEmployeeDetail = (employeeId: string) =>
  useQuery({
    queryKey: employeeDetailQueryKey(employeeId),
    queryFn: () => getEmployeeApiCall(employeeId),
    enabled: Boolean(employeeId),
  })
