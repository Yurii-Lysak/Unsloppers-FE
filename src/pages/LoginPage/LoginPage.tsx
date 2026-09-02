import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from './components/LoginForm/LoginForm'
import { useLoginPage } from './hooks/useLoginPage'

export const LoginPage = () => {
  const { t } = useTranslation()
  const { form, onSubmit, isSubmitting, sessionUnavailable, retrySession } =
    useLoginPage()

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
          <LoginForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </main>
  )
}
