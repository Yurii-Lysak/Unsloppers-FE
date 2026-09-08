import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'

export const createAddInternalCandidateFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      candidateEmployeeId: z
        .string()
        .trim()
        .min(1, t('resourcing.detail.addInternal.validation.candidateRequired')),
    }),
  )

export type AddInternalCandidateFormValues = ReturnType<
  typeof createAddInternalCandidateFormSchema
>['values']
