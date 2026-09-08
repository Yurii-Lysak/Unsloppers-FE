import { useTranslation } from 'react-i18next'
import { CounterTileGrid } from '@/components/DashboardEngine/CounterTileGrid/CounterTileGrid'
import { OwnActionItemsWidget } from '@/components/DashboardEngine/OwnActionItemsWidget/OwnActionItemsWidget'
import { QuickNavLinks } from '@/components/DashboardEngine/QuickNavLinks/QuickNavLinks'
import { ScopedPeopleTable } from '@/components/DashboardEngine/ScopedPeopleTable/ScopedPeopleTable'
import type {
  AuthoredActionItem,
  DashboardConfigResponse,
  DashboardSummaryResponse,
} from '@/types/dashboard'

interface DashboardEngineShellProps {
  config: DashboardConfigResponse
  summary: DashboardSummaryResponse
  actionItems: AuthoredActionItem[]
}

export const DashboardEngineShell = ({
  config,
  summary,
  actionItems,
}: DashboardEngineShellProps) => {
  const { t } = useTranslation()

  const tableRows =
    summary.grouping === 'people'
      ? (summary.rows ?? [])
      : (summary.groups ?? []).flatMap(group => group.rows)

  return (
    <div className="space-y-6" data-testid="dashboard-engine">
      {config.blocks.includes('counters') ? (
        <CounterTileGrid specs={config.counters} counters={summary.counters} />
      ) : null}

      {config.blocks.includes('table') ? (
        <section className="space-y-3 rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">{t('dashboard.table.title')}</h2>
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
            <ScopedPeopleTable rows={tableRows} />
          )}
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
            <QuickNavLinks />
          </section>
        ) : null}
      </div>
    </div>
  )
}
