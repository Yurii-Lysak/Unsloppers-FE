import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardCounterSpec, DashboardCounterValue } from '@/types/dashboard'

interface CounterTileGridProps {
  specs: DashboardCounterSpec[]
  counters: Record<string, DashboardCounterValue>
}

export const CounterTileGrid = ({ specs, counters }: CounterTileGridProps) => {
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" data-testid="dashboard-counter-grid">
      {specs.map(spec => {
        const counter = counters[spec.id]
        return (
          <Card key={spec.id} data-testid={`dashboard-counter-${spec.id}`}>
            <CardHeader>
              <CardTitle>{t(spec.labelKey as never)}</CardTitle>
            </CardHeader>
            <CardContent>
              {counter?.status === 'available' ? (
                <p className="text-3xl font-semibold">{counter.value ?? 0}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.unavailable')}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
