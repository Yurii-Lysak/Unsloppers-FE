import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeProfileQueryKey } from '@/api/hooks/useEmployeeProfile'
import { cdsApiService } from '@/api/services/cds.service'
import type {
  CreateIdpRecordPayload,
  UpdateIdpRecordPayload,
} from '@/types/employee-profile'

export const useCreateIdpRecord = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateIdpRecordPayload) =>
      cdsApiService.createIdpRecord(employeeId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s12.idp.create.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s12.idp.create.error'))
    },
  })
}

export const useUpdateIdpRecord = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      idpId,
      payload,
    }: {
      idpId: string
      payload: UpdateIdpRecordPayload
    }) => cdsApiService.updateIdpRecord(employeeId, idpId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s12.idp.update.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s12.idp.update.error'))
    },
  })
}

export const useCompleteIdpRecord = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (idpId: string) =>
      cdsApiService.completeIdpRecord(employeeId, idpId),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s12.idp.complete.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s12.idp.complete.error'))
    },
  })
}
