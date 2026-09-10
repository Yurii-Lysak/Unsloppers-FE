import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardIdpRow } from '@/types/dashboard'

interface IdpDeadlinesWidgetProps {
  rows?: DashboardIdpRow[]
  unavailable?: boolean
}

export const IdpDeadlinesWidget = ({
  rows,
  unavailable = false,
}: IdpDeadlinesWidgetProps) => {
  const { t } = useTranslation()

  if (unavailable) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="dashboard-idp-unavailable">
        {t('dashboard.unavailable')}
      </p>
    )
  }

  if (!rows || rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="dashboard-idp-empty">
        {t('dashboard.idp.empty')}
      </p>
    )
  }

  return (
    <ul className="space-y-3" data-testid="dashboard-idp-list">
      {rows.map(row => (
        <li
          key={row.id}
          className="rounded-md border border-border p-3"
          data-testid={`dashboard-idp-row-${row.id}`}
        >
          <div className="space-y-1">
            <p className="text-sm font-medium">{row.description}</p>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.idp.employee', { name: row.employeeDisplayName })}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.idp.deadline', { date: row.deadline })}
            </p>
          </div>
          <Link
            to={`/employees/${row.employeeId}`}
            className="mt-2 inline-block text-sm text-primary underline-offset-4 hover:underline"
          >
            {t('dashboard.idp.viewEmployee')}
          </Link>
        </li>
      ))}
    </ul>
  )
}
