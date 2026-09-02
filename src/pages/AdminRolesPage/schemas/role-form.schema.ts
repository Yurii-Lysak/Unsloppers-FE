import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'

export const createRoleFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      name: z.string().trim().min(1, t('adminRoles.validation.name')),
      permissionKeys: z.array(z.string()),
    }),
  )

export type RoleFormValues = ReturnType<typeof createRoleFormSchema>['values']
