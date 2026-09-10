import {
  useCreateContactMethod,
  useCreateEmergencyContact,
  useDeleteContactMethod,
  useDeleteEmergencyContact,
  usePatchAddress,
  useUpdateContactMethod,
  useUpdateEmergencyContact,
} from '@/api/hooks/usePersonalContacts'
import type {
  CreateContactMethodPayload,
  CreateEmergencyContactPayload,
  PatchAddressPayload,
  UpdateContactMethodPayload,
  UpdateEmergencyContactPayload,
} from '@/types/employee-profile'

export const usePersonalContactsData = (employeeId: string) => {
  const createContactMethodMutation = useCreateContactMethod(employeeId)
  const updateContactMethodMutation = useUpdateContactMethod(employeeId)
  const deleteContactMethodMutation = useDeleteContactMethod(employeeId)
  const patchAddressMutation = usePatchAddress(employeeId)
  const createEmergencyContactMutation = useCreateEmergencyContact(employeeId)
  const updateEmergencyContactMutation = useUpdateEmergencyContact(employeeId)
  const deleteEmergencyContactMutation = useDeleteEmergencyContact(employeeId)

  const createContactMethod = async (payload: CreateContactMethodPayload) => {
    await createContactMethodMutation.mutateAsync(payload)
  }

  const updateContactMethod = async (
    contactId: string,
    payload: UpdateContactMethodPayload,
  ) => {
    await updateContactMethodMutation.mutateAsync({ contactId, payload })
  }

  const deleteContactMethod = async (contactId: string) => {
    await deleteContactMethodMutation.mutateAsync(contactId)
  }

  const patchAddress = async (payload: PatchAddressPayload) => {
    await patchAddressMutation.mutateAsync(payload)
  }

  const createEmergencyContact = async (payload: CreateEmergencyContactPayload) => {
    await createEmergencyContactMutation.mutateAsync(payload)
  }

  const updateEmergencyContact = async (
    emergencyContactId: string,
    payload: UpdateEmergencyContactPayload,
  ) => {
    await updateEmergencyContactMutation.mutateAsync({
      emergencyContactId,
      payload,
    })
  }

  const deleteEmergencyContact = async (emergencyContactId: string) => {
    await deleteEmergencyContactMutation.mutateAsync(emergencyContactId)
  }

  const isMutatingPersonalContacts =
    createContactMethodMutation.isPending ||
    updateContactMethodMutation.isPending ||
    deleteContactMethodMutation.isPending ||
    patchAddressMutation.isPending

  const isMutatingEmergencyContacts =
    createEmergencyContactMutation.isPending ||
    updateEmergencyContactMutation.isPending ||
    deleteEmergencyContactMutation.isPending

  return {
    createContactMethod,
    updateContactMethod,
    deleteContactMethod,
    patchAddress,
    createEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact,
    isMutatingPersonalContacts,
    isMutatingEmergencyContacts,
    isMutating:
      isMutatingPersonalContacts || isMutatingEmergencyContacts,
  }
}
