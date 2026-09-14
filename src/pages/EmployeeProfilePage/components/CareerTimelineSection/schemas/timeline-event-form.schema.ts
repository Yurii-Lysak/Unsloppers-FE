import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'
import { TIMELINE_EVENT_TYPES } from '@/types/employee-profile'

export const createTimelineEventFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      type: z.enum(TIMELINE_EVENT_TYPES),
      effectiveDate: z
        .string()
        .min(1, { message: t('employeeProfile.s9.validation.effectiveDateRequired') })
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
          message: t('employeeProfile.s9.validation.effectiveDateInvalid'),
        }),
      oldValue: z.string().trim(),
      newValue: z.string().trim(),
    }),
  )

export type TimelineEventFormValues = ReturnType<
  typeof createTimelineEventFormSchema
>['values']
