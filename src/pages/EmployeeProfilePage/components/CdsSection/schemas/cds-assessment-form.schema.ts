import { z } from 'zod'
import type { TFunction } from 'i18next'

const calendarDatePattern = /^\d{4}-\d{2}-\d{2}$/
const httpUrlPattern = /^https?:\/\//i

const isValidUtcCalendarDate = (value: string): boolean => {
  if (!calendarDatePattern.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const createAssessmentConclusionSchema = (t: TFunction) =>
  z
    .string()
    .trim()
    .min(1, t('employeeProfile.s12.addAssessment.validation.conclusionRequired'))
    .max(
      10_000,
      t('employeeProfile.s12.addAssessment.validation.conclusionMax'),
    )

export const createCdsAssessmentFormSchema = (t: TFunction) =>
  z.object({
    date: z
      .string()
      .regex(
        calendarDatePattern,
        t('employeeProfile.s12.addAssessment.validation.dateFormat'),
      )
      .refine(
        isValidUtcCalendarDate,
        t('employeeProfile.s12.addAssessment.validation.dateFormat'),
      ),
    assessor: z
      .string()
      .trim()
      .min(1, t('employeeProfile.s12.addAssessment.validation.assessorRequired'))
      .max(200, t('employeeProfile.s12.addAssessment.validation.assessorMax')),
    resultLink: z
      .string()
      .trim()
      .url(t('employeeProfile.s12.addAssessment.validation.resultLinkFormat'))
      .refine(
        value => httpUrlPattern.test(value),
        t('employeeProfile.s12.addAssessment.validation.resultLinkFormat'),
      )
      .max(2048, t('employeeProfile.s12.addAssessment.validation.resultLinkMax')),
    conclusion: createAssessmentConclusionSchema(t),
  })

export const createAddCdsAssessmentFormSchema = (t: TFunction) => ({
  schema: createCdsAssessmentFormSchema(t),
})

const createEditAssessmentConclusionSchema = (t: TFunction) =>
  z
    .string()
    .trim()
    .min(1, t('employeeProfile.s12.editConclusion.validation.conclusionRequired'))
    .max(
      10_000,
      t('employeeProfile.s12.editConclusion.validation.conclusionMax'),
    )

export const createEditCdsAssessmentConclusionFormSchema = (t: TFunction) => ({
  schema: z.object({
    conclusion: createEditAssessmentConclusionSchema(t),
  }),
})

export type AddCdsAssessmentFormValues = z.infer<
  ReturnType<typeof createAddCdsAssessmentFormSchema>['schema']
>

export type EditCdsAssessmentConclusionFormValues = z.infer<
  ReturnType<typeof createEditCdsAssessmentConclusionFormSchema>['schema']
>
