import { Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DashboardEngineShell } from '@/components/DashboardEngine/DashboardEngineShell/DashboardEngineShell'
import { ProjectSelector } from '@/components/DashboardEngine/ProjectSelector/ProjectSelector'
import { useDashboardPage } from './hooks/useDashboardPage'

export const DashboardPage = () => {
  const { t } = useTranslation()
  const {
    configForbidden,
    isInitialLoading,
    isSummaryLoading,
    isError,
    config,
    summary,
    actionItems,
    page,
    totalPages,
    setPage,
    selectedProjectId,
    setSelectedProjectId,
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

  if (isInitialLoading) {
    return <p className="text-muted-foreground">{t('dashboard.loading')}</p>
  }

  if (isError || !config) {
    return <p className="text-destructive">{t('dashboard.loadFailed')}</p>
  }

  if (!summary && !isSummaryLoading) {
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

      {config.variant === 'dm' ? (
        <ProjectSelector
          projects={summary?.selectorProjects ?? config.selectorProjects ?? []}
          value={selectedProjectId}
          onChange={setSelectedProjectId}
        />
      ) : null}

      {isSummaryLoading ? (
        <p className="text-sm text-muted-foreground" data-testid="dashboard-summary-loading">
          {t('dashboard.loading')}
        </p>
      ) : null}

      {summary ? (
        <DashboardEngineShell
          config={config}
          summary={summary}
          actionItems={actionItems}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  )
}
