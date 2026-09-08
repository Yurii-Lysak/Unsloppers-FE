import { Navigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { useRiskDashboardPage } from './hooks/useRiskDashboardPage'
import { RiskCounterCards } from './components/RiskCounterCards/RiskCounterCards'
import { RiskDashboardTable } from './components/RiskDashboardTable/RiskDashboardTable'

export const RiskDashboardPage = () => {
  const { t } = useTranslation()
  const {
    query,
    canAccess,
    isAccessLoading,
    isDashboardLoading,
    isDashboardError,
    dashboard,
    setLevelFilter,
    clearAllFilters,
    setPage,
    totalPages,
    hasActiveFilters,
  } = useRiskDashboardPage()

  if (!isAccessLoading && !canAccess) {
    return <Navigate to="/" replace />
  }

  if (isAccessLoading || isDashboardLoading) {
    return <p className="text-muted-foreground">{t('riskDashboard.loading')}</p>
  }

  if (isDashboardError || !dashboard) {
    return <p className="text-destructive">{t('riskDashboard.loadFailed')}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground" data-testid="risk-dashboard-title">
            {t('riskDashboard.title')}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground" data-testid="risk-dashboard-count">
          {t('riskDashboard.count', {
            shown: dashboard.rows.length,
            total: dashboard.total,
          })}
        </p>
      </div>

      <RiskCounterCards
        counts={dashboard.counts}
        activeLevel={query.level}
        onSelectLevel={setLevelFilter}
      />

      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={clearAllFilters}
          disabled={!hasActiveFilters}
          data-testid="risk-dashboard-clear-filters"
        >
          {t('riskDashboard.clearFilters')}
        </Button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={(query.page ?? 1) <= 1}
            onClick={() => setPage((query.page ?? 1) - 1)}
            data-testid="risk-dashboard-prev-page"
          >
            {t('riskDashboard.previousPage')}
          </Button>
          <span className="text-sm text-muted-foreground" data-testid="risk-dashboard-page-indicator">
            {t('riskDashboard.pageIndicator', {
              page: query.page ?? 1,
              totalPages,
            })}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={(query.page ?? 1) >= totalPages}
            onClick={() => setPage((query.page ?? 1) + 1)}
            data-testid="risk-dashboard-next-page"
          >
            {t('riskDashboard.nextPage')}
          </Button>
        </div>
      </div>

      {dashboard.rows.length === 0 ? (
        <p className="text-muted-foreground" data-testid="risk-dashboard-empty">
          {t('riskDashboard.empty')}
        </p>
      ) : (
        <RiskDashboardTable rows={dashboard.rows} />
      )}
    </div>
  )
}
