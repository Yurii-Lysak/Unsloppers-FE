import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeApiService } from '@/api/services/employee.service'
import { myPermissionsQueryKey } from '@/api/hooks/useMyPermissions'

export const employeeFunctionalRolesQueryKey = (employeeId: string) =>
  ['employees', employeeId, 'functional-roles'] as const

export const useEmployeeFunctionalRoles = (employeeId: string, enabled: boolean) =>
  useQuery({
    queryKey: employeeFunctionalRolesQueryKey(employeeId),
    queryFn: () => employeeApiService.getEmployeeFunctionalRoles(employeeId),
    enabled: enabled && Boolean(employeeId),
  })

export const useSetEmployeeFunctionalRoles = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roleIds: string[]) =>
      employeeApiService.setEmployeeFunctionalRoles(employeeId, roleIds),
    onSuccess: async () => {
      toast.success(t('employeeProfile.functionalRolesSave.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeFunctionalRolesQueryKey(employeeId),
      })
      await queryClient.invalidateQueries({ queryKey: myPermissionsQueryKey })
    },
    onError: () => {
      toast.error(t('employeeProfile.functionalRolesSave.error'))
    },
  })
}
