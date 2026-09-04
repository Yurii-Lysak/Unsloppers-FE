import { z } from 'zod'
import type { RiskLevel } from '@/types/employee-profile'
import { createFormSchema } from '@/lib/form-schema'

export const RISK_LEVELS: RiskLevel[] = [
  'low',
  'need_attention',
  'medium',
  'high',
  'leaver',
]

export const createAddRiskRecordFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      level: z.enum(['low', 'need_attention', 'medium', 'high', 'leaver']),
      description: z
        .string()
        .trim()
        .min(1, {
          message: t('employeeProfile.s6.validation.descriptionRequired'),
        })
        .max(500, {
          message: t('employeeProfile.s6.validation.descriptionTooLong'),
        }),
      details: z
        .string()
        .trim()
        .min(1, { message: t('employeeProfile.s6.validation.detailsRequired') })
        .max(5000, {
          message: t('employeeProfile.s6.validation.detailsTooLong'),
        }),
      recordedAt: z
        .string()
        .min(1, {
          message: t('employeeProfile.s6.validation.recordedAtRequired'),
        })
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
          message: t('employeeProfile.s6.validation.recordedAtInvalid'),
        }),
    }),
  )

export type AddRiskRecordFormValues = ReturnType<
  typeof createAddRiskRecordFormSchema
>['values']
