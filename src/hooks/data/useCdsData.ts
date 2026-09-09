import {
  useCompleteIdpRecord,
  useCreateIdpRecord,
  useUpdateIdpRecord,
} from '@/api/hooks/useCds'
import type {
  CreateIdpRecordPayload,
  UpdateIdpRecordPayload,
} from '@/types/employee-profile'

export const useCdsData = (employeeId: string) => {
  const createIdpRecordMutation = useCreateIdpRecord(employeeId)
  const updateIdpRecordMutation = useUpdateIdpRecord(employeeId)
  const completeIdpRecordMutation = useCompleteIdpRecord(employeeId)

  const createIdpRecord = async (payload: CreateIdpRecordPayload) => {
    await createIdpRecordMutation.mutateAsync(payload)
  }

  const updateIdpRecord = async (
    idpId: string,
    payload: UpdateIdpRecordPayload,
  ) => {
    await updateIdpRecordMutation.mutateAsync({ idpId, payload })
  }

  const completeIdpRecord = async (idpId: string) => {
    await completeIdpRecordMutation.mutateAsync(idpId)
  }

  return {
    createIdpRecord,
    updateIdpRecord,
    completeIdpRecord,
    isCreatingIdpRecord: createIdpRecordMutation.isPending,
    isUpdatingIdpRecord: updateIdpRecordMutation.isPending,
    isCompletingIdpRecord: completeIdpRecordMutation.isPending,
  }
}
