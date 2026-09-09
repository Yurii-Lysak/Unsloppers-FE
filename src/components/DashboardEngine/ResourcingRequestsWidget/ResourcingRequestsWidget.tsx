import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardResourcingRequestRow } from '@/types/dashboard'

interface ResourcingRequestsWidgetProps {
  requests?: DashboardResourcingRequestRow[]
  unavailable?: boolean
}

export const ResourcingRequestsWidget = ({
  requests,
  unavailable = false,
}: ResourcingRequestsWidgetProps) => {
  const { t } = useTranslation()

  if (unavailable) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="dashboard-resourcing-unavailable">
        {t('dashboard.unavailable')}
      </p>
    )
  }

  if (!requests || requests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="dashboard-resourcing-empty">
        {t('dashboard.resourcing.empty')}
      </p>
    )
  }

  return (
    <ul className="space-y-3" data-testid="dashboard-resourcing-list">
      {requests.map(request => (
        <li
          key={request.id}
          className="rounded-md border border-border p-3"
          data-testid={`dashboard-resourcing-request-${request.id}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="text-sm font-medium">{request.vacancyDetails}</p>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.resourcing.author', { name: request.authorDisplayName })}
              </p>
              <p className="text-xs text-muted-foreground">
                {request.projectId
                  ? t('dashboard.resourcing.project', { name: request.projectId })
                  : t('dashboard.resourcing.unassignedProject')}
              </p>
            </div>
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {t(`dashboard.resourcing.status.${request.status}`)}
            </span>
          </div>
          <Link
            to={`/resourcing/${request.id}`}
            className="mt-2 inline-block text-sm text-primary underline-offset-4 hover:underline"
          >
            {t('dashboard.resourcing.viewRequest')}
          </Link>
        </li>
      ))}
    </ul>
  )
}
