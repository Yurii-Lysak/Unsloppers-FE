import { z } from 'zod'
import { defineFormSchema } from '@/lib/form-schema'

export const functionalRolesAssignmentFormSchema = defineFormSchema(
  z.object({
    roleIds: z.array(z.string()),
  }),
)

export type FunctionalRolesAssignmentFormValues =
  typeof functionalRolesAssignmentFormSchema.values
