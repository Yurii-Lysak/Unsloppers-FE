import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'

// Only these two are ever legitimate for a link opened in a browser.
const ALLOWED_LINK_PROTOCOLS = new Set(['http:', 'https:'])

const isValidExternalFormLink = (value: string): boolean => {
  try {
    const parsed = new URL(value)
    return ALLOWED_LINK_PROTOCOLS.has(parsed.protocol)
  } catch {
    return false
  }
}

const isValidCampaignDueDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export const createCampaignFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      title: z
        .string()
        .trim()
        .min(1, t('campaigns.form.validation.titleRequired'))
        .max(200, t('campaigns.form.validation.titleTooLong')),
      description: z
        .string()
        .trim()
        .min(1, t('campaigns.form.validation.descriptionRequired'))
        .max(500, t('campaigns.form.validation.descriptionTooLong')),
      purpose: z
        .string()
        .trim()
        .min(1, t('campaigns.form.validation.purposeRequired'))
        .max(2000, t('campaigns.form.validation.purposeTooLong')),
      link: z
        .string()
        .trim()
        .min(1, t('campaigns.form.validation.linkRequired'))
        .max(2048, t('campaigns.form.validation.linkTooLong'))
        .refine(isValidExternalFormLink, {
          message: t('campaigns.form.validation.linkInvalid'),
        }),
      dueDate: z
        .string()
        .min(1, t('campaigns.form.validation.dueDateRequired'))
        .refine(isValidCampaignDueDate, {
          message: t('campaigns.form.validation.dueDateInvalid'),
        }),
    }),
  )

export type CampaignFormValues = ReturnType<
  typeof createCampaignFormSchema
>['values']
