import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { employeeProfileQueryKey } from '@/api/hooks/useEmployeeProfile'
import { personalContactsApiService } from '@/api/services/personal-contacts.service'
import type {
  CreateContactMethodPayload,
  CreateEmergencyContactPayload,
  PatchAddressPayload,
  UpdateContactMethodPayload,
  UpdateEmergencyContactPayload,
} from '@/types/employee-profile'

export const useCreateContactMethod = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateContactMethodPayload) =>
      personalContactsApiService.createContactMethod(employeeId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s2.create.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s2.create.error'))
    },
  })
}

export const useUpdateContactMethod = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      contactId,
      payload,
    }: {
      contactId: string
      payload: UpdateContactMethodPayload
    }) =>
      personalContactsApiService.updateContactMethod(employeeId, contactId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s2.update.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s2.update.error'))
    },
  })
}

export const useDeleteContactMethod = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (contactId: string) =>
      personalContactsApiService.deleteContactMethod(employeeId, contactId),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s2.delete.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s2.delete.error'))
    },
  })
}

export const usePatchAddress = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PatchAddressPayload) =>
      personalContactsApiService.patchAddress(employeeId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s2.address.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s2.address.error'))
    },
  })
}

export const useCreateEmergencyContact = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateEmergencyContactPayload) =>
      personalContactsApiService.createEmergencyContact(employeeId, payload),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s3.create.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s3.create.error'))
    },
  })
}

export const useUpdateEmergencyContact = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      emergencyContactId,
      payload,
    }: {
      emergencyContactId: string
      payload: UpdateEmergencyContactPayload
    }) =>
      personalContactsApiService.updateEmergencyContact(
        employeeId,
        emergencyContactId,
        payload,
      ),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s3.update.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s3.update.error'))
    },
  })
}

export const useDeleteEmergencyContact = (employeeId: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (emergencyContactId: string) =>
      personalContactsApiService.deleteEmergencyContact(employeeId, emergencyContactId),
    onSuccess: async () => {
      toast.success(t('employeeProfile.s3.delete.success'))
      await queryClient.invalidateQueries({
        queryKey: employeeProfileQueryKey(employeeId),
      })
    },
    onError: () => {
      toast.error(t('employeeProfile.s3.delete.error'))
    },
  })
}
