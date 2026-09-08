import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'
import { createCampaignFormSchema } from '@/pages/CampaignsPage/schemas/campaign-form.schema'

export const createRequestFeedbackFormSchema = (t: (key: string) => string) => {
  const { schema: campaignSchema } = createCampaignFormSchema(t)

  return createFormSchema(() =>
    campaignSchema.extend({
      colleagueIds: z
        .array(z.string().uuid())
        .min(1, t('employeeProfile.s8.requestFeedback.validation.colleaguesRequired')),
    }),
  )
}

export type RequestFeedbackFormValues = ReturnType<
  typeof createRequestFeedbackFormSchema
>['values']

export const buildRequestFeedbackDefaultValues = (
  t: (key: string, options?: { name: string }) => string,
  subjectDisplayName: string,
): RequestFeedbackFormValues => ({
  title: t('employeeProfile.s8.requestFeedback.defaults.title', {
    name: subjectDisplayName,
  }),
  description: t('employeeProfile.s8.requestFeedback.defaults.description', {
    name: subjectDisplayName,
  }),
  purpose: t('employeeProfile.s8.requestFeedback.defaults.purpose', {
    name: subjectDisplayName,
  }),
  link: '',
  dueDate: '',
  colleagueIds: [],
})
