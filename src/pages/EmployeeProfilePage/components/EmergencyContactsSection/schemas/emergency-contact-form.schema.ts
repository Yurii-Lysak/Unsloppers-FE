import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'
import { isLikelyPhoneNumber } from '@/lib/phone'

export const createEmergencyContactFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      contactPerson: z
        .string()
        .trim()
        .min(1, {
          message: t('employeeProfile.s3.validation.contactPersonRequired'),
        })
        .max(200, {
          message: t('employeeProfile.s3.validation.contactPersonTooLong'),
        }),
      relationship: z
        .string()
        .trim()
        .min(1, {
          message: t('employeeProfile.s3.validation.relationshipRequired'),
        })
        .max(200, {
          message: t('employeeProfile.s3.validation.relationshipTooLong'),
        }),
      phone: z
        .string()
        .trim()
        .min(1, { message: t('employeeProfile.s3.validation.phoneRequired') })
        .max(50, { message: t('employeeProfile.s3.validation.phoneTooLong') })
        .refine(isLikelyPhoneNumber, {
          message: t('employeeProfile.s3.validation.phoneInvalid'),
        }),
    }),
  )

export type EmergencyContactFormValues = ReturnType<
  typeof createEmergencyContactFormSchema
>['values']
