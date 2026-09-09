import { z } from 'zod'
import type { TFunction } from 'i18next'

const calendarDatePattern = /^\d{4}-\d{2}-\d{2}$/
const httpUrlPattern = /^https?:\/\//i

const isValidCalendarDate = (value: string): boolean => {
  const match = calendarDatePattern.exec(value)
  if (!match) {
    return false
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export const createIdpRecordFormSchema = (t: TFunction) =>
  z.object({
    description: z
      .string()
      .trim()
      .min(1, t('employeeProfile.s12.idp.validation.descriptionRequired'))
      .max(2000, t('employeeProfile.s12.idp.validation.descriptionMax')),
    deadline: z
      .string()
      .regex(calendarDatePattern, t('employeeProfile.s12.idp.validation.deadlineFormat'))
      .refine(isValidCalendarDate, t('employeeProfile.s12.idp.validation.deadlineFormat')),
    fileUrl: z
      .string()
      .trim()
      .url(t('employeeProfile.s12.idp.validation.fileUrlFormat'))
      .refine(
        value => httpUrlPattern.test(value),
        t('employeeProfile.s12.idp.validation.fileUrlFormat'),
      )
      .max(2048, t('employeeProfile.s12.idp.validation.fileUrlMax')),
  })

export const createAddIdpRecordFormSchema = (t: TFunction) => ({
  schema: createIdpRecordFormSchema(t),
})

export const createEditIdpRecordFormSchema = (t: TFunction) => ({
  schema: createIdpRecordFormSchema(t),
})

export type AddIdpRecordFormValues = z.infer<
  ReturnType<typeof createAddIdpRecordFormSchema>['schema']
>

export type EditIdpRecordFormValues = z.infer<
  ReturnType<typeof createEditIdpRecordFormSchema>['schema']
>
