import { useCreateRiskRecord } from '@/api/hooks/useRiskMutations'
import type { CreateRiskRecordPayload } from '@/types/employee-profile'

export const useRisksData = (employeeId: string) => {
  const createRecordMutation = useCreateRiskRecord(employeeId)

  const createRecord = async (payload: CreateRiskRecordPayload) => {
    await createRecordMutation.mutateAsync(payload)
  }

  return {
    createRecord,
    isCreatingRecord: createRecordMutation.isPending,
  }
}
