import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'

const todayCalendarDate = (): string => new Date().toISOString().slice(0, 10)

const isValidCalendarDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

export const createAddFeedbackFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      recordedAt: z
        .string()
        .min(1, {
          message: t('employeeProfile.s8.validation.recordedAtRequired'),
        })
        .regex(/^\d{4}-\d{2}-\d{2}$/, {
          message: t('employeeProfile.s8.validation.recordedAtInvalid'),
        })
        .refine(isValidCalendarDate, {
          message: t('employeeProfile.s8.validation.recordedAtInvalid'),
        })
        .refine(date => date <= todayCalendarDate(), {
          message: t('employeeProfile.s8.validation.recordedAtFuture'),
        }),
      context: z
        .string()
        .trim()
        .min(1, {
          message: t('employeeProfile.s8.validation.contextRequired'),
        })
        .max(500, {
          message: t('employeeProfile.s8.validation.contextTooLong'),
        }),
      body: z
        .string()
        .trim()
        .min(1, { message: t('employeeProfile.s8.validation.bodyRequired') })
        .max(10_000, {
          message: t('employeeProfile.s8.validation.bodyTooLong'),
        }),
      sharedWithEmployee: z.boolean(),
    }),
  )

export const createEditFeedbackFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      context: z
        .string()
        .trim()
        .min(1, {
          message: t('employeeProfile.s8.validation.contextRequired'),
        })
        .max(500, {
          message: t('employeeProfile.s8.validation.contextTooLong'),
        }),
      body: z
        .string()
        .trim()
        .min(1, { message: t('employeeProfile.s8.validation.bodyRequired') })
        .max(10_000, {
          message: t('employeeProfile.s8.validation.bodyTooLong'),
        }),
    }),
  )

export type AddFeedbackFormValues = ReturnType<
  typeof createAddFeedbackFormSchema
>['values']

export type EditFeedbackFormValues = ReturnType<
  typeof createEditFeedbackFormSchema
>['values']

export { todayCalendarDate }
