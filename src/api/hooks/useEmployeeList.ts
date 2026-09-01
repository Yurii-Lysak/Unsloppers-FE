import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { listEmployeesApiCall } from '@/api/employees'
import type { EmployeeListQuery } from '@/types/employees'

export const employeeListQueryKey = (query: EmployeeListQuery) =>
  ['employees', 'list', query] as const

export const useEmployeeList = (query: EmployeeListQuery) =>
  useQuery({
    queryKey: employeeListQueryKey(query),
    queryFn: () => listEmployeesApiCall(query),
    retry: (_, error) => {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 ||
          error.response?.status === 403 ||
          error.response?.status === 400)
      ) {
        return false
      }
      return true
    },
  })
