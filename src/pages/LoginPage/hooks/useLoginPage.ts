import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { isUnauthorizedError } from '@/api/errors'
import { getSafePostLoginDestination } from '../helpers/redirect'

interface LoginLocationState {
  from?: string
}

export const useLoginPage = () => {
  const { t } = useTranslation()
  const { session, status, login, retrySession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const schema = useMemo(
    () =>
      z.object({
        email: z.email(t('auth.validation.email')),
        password: z.string().min(1, t('auth.validation.password')),
      }),
    [t]
  )
  type LoginFormValues = z.infer<typeof schema>

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const requestedPath = (location.state as LoginLocationState | null)?.from
  const destination = getSafePostLoginDestination(requestedPath)

  useEffect(() => {
    if (session) {
      navigate(destination, { replace: true })
    }
  }, [destination, navigate, session])

  const submit = form.handleSubmit(async values => {
    try {
      await login(values)
      navigate(destination, { replace: true })
    } catch (error) {
      form.setError('root', {
        message: isUnauthorizedError(error)
          ? t('auth.invalidCredentials')
          : t('auth.loginUnavailable'),
      })
    }
  })

  return {
    register: form.register,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    sessionUnavailable: status === 'unavailable',
    retrySession,
    submit,
  }
}
