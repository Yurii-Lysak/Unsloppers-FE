import { useQuery } from '@tanstack/react-query'
import {
  employeeProfileQueryKey,
  getEmployeeProfileApiCall,
} from '@/api/employee-profile'

export const useEmployeeProfile = (employeeId: string) =>
  useQuery({
    queryKey: employeeProfileQueryKey(employeeId),
    queryFn: () => getEmployeeProfileApiCall(employeeId),
    enabled: Boolean(employeeId),
  })
