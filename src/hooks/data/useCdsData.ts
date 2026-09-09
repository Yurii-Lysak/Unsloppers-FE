import {
  useCompleteIdpRecord,
  useCreateAssessment,
  useCreateIdpRecord,
  useUpdateAssessmentConclusion,
  useUpdateIdpRecord,
} from '@/api/hooks/useCds'
import type {
  CreateCdsAssessmentPayload,
  CreateIdpRecordPayload,
  UpdateCdsAssessmentConclusionPayload,
  UpdateIdpRecordPayload,
} from '@/types/employee-profile'

export const useCdsData = (employeeId: string) => {
  const createIdpRecordMutation = useCreateIdpRecord(employeeId)
  const updateIdpRecordMutation = useUpdateIdpRecord(employeeId)
  const completeIdpRecordMutation = useCompleteIdpRecord(employeeId)
  const createAssessmentMutation = useCreateAssessment(employeeId)
  const updateAssessmentConclusionMutation = useUpdateAssessmentConclusion(employeeId)

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

  const createAssessment = async (payload: CreateCdsAssessmentPayload) => {
    await createAssessmentMutation.mutateAsync(payload)
  }

  const updateAssessmentConclusion = async (
    assessmentId: string,
    payload: UpdateCdsAssessmentConclusionPayload,
  ) => {
    await updateAssessmentConclusionMutation.mutateAsync({
      assessmentId,
      payload,
    })
  }

  return {
    createIdpRecord,
    updateIdpRecord,
    completeIdpRecord,
    createAssessment,
    updateAssessmentConclusion,
    isCreatingIdpRecord: createIdpRecordMutation.isPending,
    isUpdatingIdpRecord: updateIdpRecordMutation.isPending,
    isCompletingIdpRecord: completeIdpRecordMutation.isPending,
    isCreatingAssessment: createAssessmentMutation.isPending,
    isUpdatingAssessmentConclusion: updateAssessmentConclusionMutation.isPending,
  }
}
