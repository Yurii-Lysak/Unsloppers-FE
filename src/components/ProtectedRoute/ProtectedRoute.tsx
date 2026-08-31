import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { t } = useTranslation()
  const { session, status, retrySession } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <main className="grid min-h-screen place-items-center bg-background text-foreground">
        <p role="status">{t('auth.loadingSession')}</p>
      </main>
    )
  }

  if (status === 'unavailable') {
    return (
      <main className="grid min-h-screen place-items-center bg-background p-4 text-foreground">
        <div className="max-w-md space-y-4 text-center" role="alert">
          <h1 className="text-lg font-semibold">{t('auth.sessionUnavailable.title')}</h1>
          <p className="text-muted-foreground">{t('auth.sessionUnavailable.description')}</p>
          <Button onClick={retrySession}>{t('auth.sessionUnavailable.retry')}</Button>
        </div>
      </main>
    )
  }

  if (!session) {
    const from = `${location.pathname}${location.search}${location.hash}`
    return <Navigate to="/login" replace state={{ from }} />
  }

  return children
}
