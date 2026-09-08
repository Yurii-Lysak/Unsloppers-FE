import { useQuery } from '@tanstack/react-query'
import { employeeApiService } from '@/api/services/employee.service'

export const employeeLookupQueryKey = ['employees', 'lookup'] as const

export const useEmployeeLookup = (enabled: boolean) =>
  useQuery({
    queryKey: employeeLookupQueryKey,
    queryFn: () => employeeApiService.getEmployeeLookup(),
    enabled,
  })
