import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'
import { isLikelyPhoneNumber } from '@/lib/phone'

const contactMethodTypeSchema = z.enum(['PHONE', 'EMAIL', 'MESSENGER'])

const contactMethodValueSchema = (t: (key: string) => string) =>
  z
    .string()
    .trim()
    .min(1, { message: t('employeeProfile.s2.validation.valueRequired') })
    .max(500, { message: t('employeeProfile.s2.validation.valueTooLong') })

export const createContactMethodFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z
      .object({
        type: contactMethodTypeSchema,
        label: z
          .string()
          .trim()
          .min(1, { message: t('employeeProfile.s2.validation.labelRequired') })
          .max(200, { message: t('employeeProfile.s2.validation.labelTooLong') }),
        value: contactMethodValueSchema(t),
      })
      .superRefine((values, ctx) => {
        if (
          values.type === 'EMAIL' &&
          !z.string().email().safeParse(values.value).success
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['value'],
            message: t('employeeProfile.s2.validation.emailInvalid'),
          })
        }

        if (values.type === 'PHONE' && !isLikelyPhoneNumber(values.value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['value'],
            message: t('employeeProfile.s2.validation.phoneInvalid'),
          })
        }
      }),
  )

export type ContactMethodFormValues = ReturnType<
  typeof createContactMethodFormSchema
>['values']

export const createAddressFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      residentialAddress: z
        .string()
        .trim()
        .max(1000, {
          message: t('employeeProfile.s2.validation.addressTooLong'),
        }),
      placeOfStay: z
        .string()
        .trim()
        .max(1000, {
          message: t('employeeProfile.s2.validation.addressTooLong'),
        }),
    }),
  )

export type AddressFormValues = ReturnType<typeof createAddressFormSchema>['values']
