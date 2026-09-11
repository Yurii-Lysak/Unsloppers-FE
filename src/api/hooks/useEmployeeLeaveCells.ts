import { useQuery } from '@tanstack/react-query'
import { employeeApiService } from '@/api/services/employee.service'

export const employeeLeaveCellsQueryKey = (employeeIds: string[]) =>
  ['employees', 'leaves', [...employeeIds].sort()] as const

export const useEmployeeLeaveCells = (employeeIds: string[], enabled: boolean) =>
  useQuery({
    queryKey: employeeLeaveCellsQueryKey(employeeIds),
    queryFn: () => employeeApiService.getEmployeeLeaveCells(employeeIds),
    enabled: employeeIds.length > 0 && enabled,
  })
