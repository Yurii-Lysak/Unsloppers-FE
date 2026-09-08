import type { TFunction } from 'i18next'
import { z } from 'zod'

export const createEndPairFormSchema = (t: TFunction) => {
  const schema = z.object({
    closureFeedback: z
      .string()
      .trim()
      .min(1, t('mentorshipHub.end.validation.feedbackRequired')),
  })

  return { schema }
}

export type EndPairFormValues = z.infer<
  ReturnType<typeof createEndPairFormSchema>['schema']
>
