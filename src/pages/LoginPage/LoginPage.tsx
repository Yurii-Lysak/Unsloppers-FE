import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginPage } from './hooks/useLoginPage'

export const LoginPage = () => {
  const { t } = useTranslation()
  const {
    register,
    errors,
    isSubmitting,
    sessionUnavailable,
    retrySession,
    submit,
  } = useLoginPage()

  if (sessionUnavailable) {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-4 text-foreground">
        <Card className="w-full max-w-sm" role="alert">
          <CardHeader>
            <CardTitle>
              <h1>{t('auth.sessionUnavailable.title')}</h1>
            </CardTitle>
            <CardDescription>{t('auth.sessionUnavailable.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={retrySession}>
              {t('auth.sessionUnavailable.retry')}
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            <h1>{t('auth.login.title')}</h1>
          </CardTitle>
          <CardDescription>{t('auth.login.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" noValidate onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.login.email')}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.login.password')}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            {errors.root && (
              <p role="alert" className="text-sm text-destructive">
                {errors.root.message}
              </p>
            )}
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('auth.login.submitting') : t('auth.login.submit')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
