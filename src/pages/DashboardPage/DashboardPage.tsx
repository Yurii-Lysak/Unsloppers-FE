import { Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DashboardEngineShell } from '@/components/DashboardEngine/DashboardEngineShell/DashboardEngineShell'
import { useDashboardPage } from './hooks/useDashboardPage'

export const DashboardPage = () => {
  const { t } = useTranslation()
  const {
    configForbidden,
    isLoading,
    isError,
    config,
    summary,
    actionItems,
  } = useDashboardPage()

  if (configForbidden) {
    return (
      <main
        className="grid min-h-[50vh] place-items-center"
        data-testid="dashboard-access-denied"
      >
        <p className="text-muted-foreground">{t('dashboard.accessDenied')}</p>
      </main>
    )
  }

  if (isLoading) {
    return <p className="text-muted-foreground">{t('dashboard.loading')}</p>
  }

  if (isError || !config || !summary) {
    return <p className="text-destructive">{t('dashboard.loadFailed')}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <Home className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold text-foreground" data-testid="dashboard-title">
          {t('dashboard.title')}
        </h1>
      </div>

      <DashboardEngineShell
        config={config}
        summary={summary}
        actionItems={actionItems}
      />
    </div>
  )
}
