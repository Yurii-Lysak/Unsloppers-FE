import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeApiService } from '@/api/services/employee.service'
import type { EmployeeListExportQuery } from '@/types/employees'

export const useExportEmployeesList = () => {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (query: EmployeeListExportQuery) =>
      employeeApiService.exportEmployeesList(query),
    onSuccess: () => {
      toast.success(t('directory.export.success'))
    },
    onError: () => {
      toast.error(t('directory.export.failed'))
    },
  })
}
