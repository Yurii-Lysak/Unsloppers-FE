import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeApiService } from '@/api/services/employee.service'
import { employeeListQueryKey } from '@/api/hooks/useEmployeeList'
import type { EmployeeListQuery, FieldValue } from '@/types/employees'

export const useUpdateEmployeeField = (query: EmployeeListQuery) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      employeeId,
      fieldId,
      value,
    }: {
      employeeId: string
      fieldId: string
      value: FieldValue
    }) => employeeApiService.updateEmployeeField(employeeId, fieldId, value),
    onSuccess: async () => {
      toast.success(t('directory.inlineEdit.saveSuccess'))
      await queryClient.invalidateQueries({ queryKey: employeeListQueryKey(query) })
    },
    onError: () => {
      toast.error(t('directory.inlineEdit.saveFailed'))
    },
  })
}
