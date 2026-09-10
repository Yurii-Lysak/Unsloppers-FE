import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeProfileQueryKey } from '@/api/hooks/useEmployeeProfile'
import { documentsApiService } from '@/api/services/documents.service'
import type { DocumentType } from '@/types/employee-profile'

export const useUploadDocument = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, file }: { type: DocumentType; file: File }) =>
      documentsApiService.uploadDocument(employeeId, type, file),
    onSuccess: async () => {
      toast.success(t('employeeProfile.sections.documents.upload.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.sections.documents.upload.error'))
    },
  })
}
