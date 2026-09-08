import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { RiskDashboardCounts, RiskLevel } from '@/types/risk-dashboard'
import { RISK_DASHBOARD_COUNTER_LEVELS } from '@/types/risk-dashboard'

interface RiskCounterCardsProps {
  counts: RiskDashboardCounts
  activeLevel?: RiskLevel
  onSelectLevel: (level?: RiskLevel) => void
}

const emphasizedBorderClass: Partial<Record<RiskLevel, string>> = {
  medium: 'ring-risk-medium/60',
  high: 'ring-risk-high/70',
  leaver: 'ring-risk-leaver/70',
}

export const RiskCounterCards = ({
  counts,
  activeLevel,
  onSelectLevel,
}: RiskCounterCardsProps) => {
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Card
        className={cn(
          'cursor-pointer transition hover:bg-muted/40',
          activeLevel === undefined && 'ring-2 ring-primary/40',
        )}
        onClick={() => onSelectLevel(undefined)}
        data-testid="risk-counter-total-active"
      >
        <CardHeader>
          <CardTitle>{t('riskDashboard.counters.totalActive')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{counts.totalActive}</p>
        </CardContent>
      </Card>

      {RISK_DASHBOARD_COUNTER_LEVELS.map(level => (
        <Card
          key={level}
          className={cn(
            'cursor-pointer transition hover:bg-muted/40 ring-2',
            emphasizedBorderClass[level] ?? 'ring-transparent',
            activeLevel === level && 'ring-primary/60',
          )}
          onClick={() => onSelectLevel(level)}
          data-testid={`risk-counter-${level}`}
        >
          <CardHeader>
            <CardTitle>{t(`employeeProfile.s6.levels.${level}`)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{counts[level]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
