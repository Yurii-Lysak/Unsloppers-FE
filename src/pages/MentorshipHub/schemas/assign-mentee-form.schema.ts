import { z } from 'zod'
import type { TFunction } from 'i18next'

export interface AssignMenteeFormValues {
  menteeId: string
}

export const createAssignMenteeFormSchema = (t: TFunction) => {
  const schema = z.object({
    menteeId: z.string().min(1, t('mentorshipHub.validation.menteeRequired')),
  })

  return { schema }
}
