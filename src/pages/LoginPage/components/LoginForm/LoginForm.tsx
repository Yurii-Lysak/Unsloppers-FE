import { useTranslation } from 'react-i18next'
import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { FormRootError } from '@/components/Form/components/FormRootError/FormRootError'
import { Input } from '@/components/Input/Input'
import type { LoginFormValues } from '../../schemas/login-form.schema'

interface LoginFormProps {
  form: UseFormReturn<LoginFormValues>
  onSubmit: (values: LoginFormValues) => Promise<void>
  isSubmitting: boolean
}

export const LoginForm = ({ form, onSubmit, isSubmitting }: LoginFormProps) => {
  const { t } = useTranslation()

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <Input
        name="email"
        type="email"
        label={t('auth.login.email')}
        autoComplete="username"
      />
      <Input
        name="password"
        type="password"
        label={t('auth.login.password')}
        autoComplete="current-password"
      />
      <FormRootError />
      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
      </Button>
    </Form>
  )
}
