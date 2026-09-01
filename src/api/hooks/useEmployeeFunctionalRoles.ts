import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getEmployeeFunctionalRolesApiCall,
  setEmployeeFunctionalRolesApiCall,
} from '@/api/employees'
import { myPermissionsQueryKey } from '@/api/hooks/useMyPermissions'

export const employeeFunctionalRolesQueryKey = (employeeId: string) =>
  ['employees', employeeId, 'functional-roles'] as const

export const useEmployeeFunctionalRoles = (employeeId: string, enabled: boolean) =>
  useQuery({
    queryKey: employeeFunctionalRolesQueryKey(employeeId),
    queryFn: () => getEmployeeFunctionalRolesApiCall(employeeId),
    enabled: enabled && Boolean(employeeId),
  })

export const useSetEmployeeFunctionalRoles = (employeeId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roleIds: string[]) =>
      setEmployeeFunctionalRolesApiCall(employeeId, roleIds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: employeeFunctionalRolesQueryKey(employeeId),
      })
      await queryClient.invalidateQueries({ queryKey: myPermissionsQueryKey })
    },
  })
}
