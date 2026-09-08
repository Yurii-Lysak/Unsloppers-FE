import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'

export const createResourcingFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      vacancyDetails: z
        .string()
        .trim()
        .min(1, t('resourcing.form.validation.vacancyDetailsRequired'))
        .max(5000, t('resourcing.form.validation.vacancyDetailsTooLong')),
      expectedCompBand: z
        .string()
        .trim()
        .min(1, t('resourcing.form.validation.expectedCompBandRequired'))
        .max(200, t('resourcing.form.validation.expectedCompBandTooLong')),
      duration: z
        .string()
        .trim()
        .min(1, t('resourcing.form.validation.durationRequired'))
        .max(200, t('resourcing.form.validation.durationTooLong')),
      workload: z
        .string()
        .trim()
        .min(1, t('resourcing.form.validation.workloadRequired'))
        .max(200, t('resourcing.form.validation.workloadTooLong')),
      headcount: z.preprocess(
        value => {
          if (value === '' || value === undefined || value === null) {
            return 1
          }
          return Number(value)
        },
        z
          .number()
          .int()
          .min(1, t('resourcing.form.validation.headcountMin'))
          .max(99, t('resourcing.form.validation.headcountMax')),
      ),
      department: z
        .string()
        .trim()
        .min(1, t('resourcing.form.validation.departmentRequired'))
        .max(200, t('resourcing.form.validation.departmentTooLong')),
      projectId: z
        .string()
        .trim()
        .max(128, t('resourcing.form.validation.projectIdTooLong'))
        .optional()
        .transform(value => (value && value.length > 0 ? value : undefined)),
    }),
  )

export type ResourcingFormValues = {
  vacancyDetails: string
  expectedCompBand: string
  duration: string
  workload: string
  headcount: number
  department: string
  projectId?: string
}
