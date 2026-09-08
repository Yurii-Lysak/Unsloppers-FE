import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'

// Only these two are ever legitimate for a link opened in a browser.
const ALLOWED_LINK_PROTOCOLS = new Set(['http:', 'https:'])

const isValidPeopleForceUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value)
    return ALLOWED_LINK_PROTOCOLS.has(parsed.protocol)
  } catch {
    return false
  }
}

export const createAddExternalCandidateFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      peopleForceCandidateUrl: z
        .string()
        .trim()
        .min(1, t('resourcing.detail.addExternal.validation.urlRequired'))
        .max(2000, t('resourcing.detail.addExternal.validation.urlTooLong'))
        .refine(isValidPeopleForceUrl, {
          message: t('resourcing.detail.addExternal.validation.urlInvalid'),
        }),
      peopleForceCandidateId: z
        .string()
        .trim()
        .max(128, t('resourcing.detail.addExternal.validation.idTooLong'))
        .optional()
        .transform(value => (value && value.length > 0 ? value : undefined)),
    }),
  )

export type AddExternalCandidateFormValues = ReturnType<
  typeof createAddExternalCandidateFormSchema
>['values']
