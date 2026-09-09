import { useTranslation } from 'react-i18next'
import { CounterTileGrid } from '@/components/DashboardEngine/CounterTileGrid/CounterTileGrid'
import { OwnActionItemsWidget } from '@/components/DashboardEngine/OwnActionItemsWidget/OwnActionItemsWidget'
import { QuickNavLinks } from '@/components/DashboardEngine/QuickNavLinks/QuickNavLinks'
import { ResourcingRequestsWidget } from '@/components/DashboardEngine/ResourcingRequestsWidget/ResourcingRequestsWidget'
import { ScopedPeopleTable } from '@/components/DashboardEngine/ScopedPeopleTable/ScopedPeopleTable'
import { Button } from '@/components/ui/button'
import type {
  AuthoredActionItem,
  DashboardConfigResponse,
  DashboardSummaryResponse,
} from '@/types/dashboard'

interface DashboardEngineShellProps {
  config: DashboardConfigResponse
  summary: DashboardSummaryResponse
  actionItems: AuthoredActionItem[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export const DashboardEngineShell = ({
  config,
  summary,
  actionItems,
  page = 1,
  totalPages = 1,
  onPageChange,
}: DashboardEngineShellProps) => {
  const { t } = useTranslation()

  const tableTitle =
    config.grouping === 'project'
      ? t('dashboard.table.projectsTitle')
      : t('dashboard.table.title')

  const tableRows =
    summary.grouping === 'people'
      ? (summary.rows ?? [])
      : (summary.groups ?? []).flatMap(group => group.rows)

  const showPagination =
    summary.grouping === 'people' &&
    config.variant === 'um' &&
    summary.pagination !== undefined &&
    summary.pagination.totalRows > summary.pagination.pageSize

  return (
    <div className="space-y-6" data-testid="dashboard-engine">
      {config.blocks.includes('counters') ? (
        <CounterTileGrid specs={config.counters} counters={summary.counters} />
      ) : null}

      {config.blocks.includes('table') ? (
        <section className="space-y-3 rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">{tableTitle}</h2>
          {summary.grouping === 'project' ? (
            <div className="space-y-6">
              {(summary.groups ?? []).map(group => (
                <div key={group.projectId} data-testid={`dashboard-group-${group.projectId}`}>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                    {group.projectName}
                  </h3>
                  <ScopedPeopleTable rows={group.rows} />
                </div>
              ))}
            </div>
          ) : (
            <>
              <ScopedPeopleTable rows={tableRows} />
              {showPagination && onPageChange ? (
                <div
                  className="flex items-center justify-between gap-3"
                  data-testid="dashboard-table-pagination"
                >
                  <p className="text-sm text-muted-foreground">
                    {t('dashboard.pagination.summary', {
                      page,
                      totalPages,
                      totalRows: summary.pagination?.totalRows ?? 0,
                    })}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => onPageChange(page - 1)}
                      data-testid="dashboard-pagination-prev"
                    >
                      {t('dashboard.pagination.previous')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => onPageChange(page + 1)}
                      data-testid="dashboard-pagination-next"
                    >
                      {t('dashboard.pagination.next')}
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </section>
      ) : null}

      {config.blocks.includes('resourcingRequests') ? (
        <section
          className="space-y-3 rounded-lg border border-border bg-card p-4"
          data-testid="dashboard-resourcing-block"
        >
          <h2 className="text-sm font-semibold">{t('dashboard.resourcing.title')}</h2>
          <ResourcingRequestsWidget
            requests={summary.resourcingRequests}
            unavailable={summary.resourcingRequests === undefined}
          />
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        {config.blocks.includes('ownActionItems') ? (
          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">{t('dashboard.actionItems.title')}</h2>
            <OwnActionItemsWidget items={actionItems} />
          </section>
        ) : null}

        {config.blocks.includes('quickNav') ? (
          <section className="rounded-lg border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">{t('dashboard.quickNav.title')}</h2>
            <QuickNavLinks links={config.quickNav} />
          </section>
        ) : null}
      </div>
    </div>
  )
}
