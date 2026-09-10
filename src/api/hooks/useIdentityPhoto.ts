import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeProfileQueryKey } from '@/api/hooks/useEmployeeProfile'
import { identityApiService } from '@/api/services/identity.service'

export const useUploadIdentityPhoto = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => identityApiService.uploadPhoto(employeeId, file),
    onSuccess: async () => {
      toast.success(t('employeeProfile.header.photoUpload.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.header.photoUpload.error'))
    },
  })
}
