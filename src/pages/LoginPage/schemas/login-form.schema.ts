import { z } from 'zod'
import { createFormSchema } from '@/lib/form-schema'

export const createLoginFormSchema = (t: (key: string) => string) =>
  createFormSchema(() =>
    z.object({
      email: z.email(t('auth.validation.email')),
      password: z.string().min(1, t('auth.validation.password')),
    }),
  )

export type LoginFormValues = ReturnType<typeof createLoginFormSchema>['values']
