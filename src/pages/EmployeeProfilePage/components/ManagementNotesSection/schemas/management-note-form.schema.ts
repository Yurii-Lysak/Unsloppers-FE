import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'

export const createEditManagementNoteFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      content: z
        .string()
        .trim()
        .min(1, { message: t('employeeProfile.s7.validation.contentRequired') })
        .max(10_000, {
          message: t('employeeProfile.s7.validation.contentTooLong'),
        }),
    }),
  )

export type EditManagementNoteFormValues = ReturnType<
  typeof createEditManagementNoteFormSchema
>['values']

export const createAddManagementNoteFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      content: z
        .string()
        .trim()
        .min(1, { message: t('employeeProfile.s7.validation.contentRequired') })
        .max(10_000, {
          message: t('employeeProfile.s7.validation.contentTooLong'),
        }),
      visibleForEmployee: z.boolean(),
      visibleForPm: z.boolean(),
    }),
  )

export type AddManagementNoteFormValues = ReturnType<
  typeof createAddManagementNoteFormSchema
>['values']
