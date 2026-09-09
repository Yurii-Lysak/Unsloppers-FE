import { useTranslation } from 'react-i18next'
import type {
  ProfileSectionEnvelope,
  RequestHistoryEntry,
  RequestHistorySection as RequestHistorySectionData,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'

interface RequestHistorySectionCardProps {
  section: ProfileSectionEnvelope<RequestHistorySectionData>
}

export const RequestHistorySectionCard = ({
  section,
}: RequestHistorySectionCardProps) => {
  const { t } = useTranslation()

  if (!isSectionData<RequestHistorySectionData>(section)) {
    return null
  }

  const entries = Array.isArray(section.data.entries) ? section.data.entries : []

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="request-history-empty">
        {t('employeeProfile.s15.empty')}
      </p>
    )
  }

  return (
    <ul className="space-y-3" data-testid="request-history-section">
      {entries.map(entry => (
        <RequestHistoryEntryItem key={entry.id} entry={entry} />
      ))}
    </ul>
  )
}

const formatHistoryDate = (iso: string) => {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString()
}

const RequestHistoryEntryItem = ({ entry }: { entry: RequestHistoryEntry }) => {
  const { t } = useTranslation()
  const statusLabel = ['proposed', 'approved', 'rejected'].includes(entry.status)
    ? t(`employeeProfile.s15.status.${entry.status}`)
    : entry.status

  return (
    <li
      className="rounded-md border border-border p-3 text-sm"
      data-testid={`request-history-entry-${entry.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="font-medium text-foreground">{entry.vacancyDetails}</p>
          <p className="text-muted-foreground">
            {entry.department}
            {entry.projectName
              ? ` · ${t('employeeProfile.s15.project', { project: entry.projectName })}`
              : null}
          </p>
        </div>
        <span className="text-muted-foreground">{statusLabel}</span>
      </div>
      {entry.requestStatus ? (
        <p className="text-muted-foreground">
          {t(`employeeProfile.s15.requestStatus.${entry.requestStatus}`)}
        </p>
      ) : null}
      <p className="mt-2 text-muted-foreground">
        {t('employeeProfile.s15.proposedAt', {
          date: formatHistoryDate(entry.proposedAt),
        })}
        {entry.decidedAt
          ? ` · ${t('employeeProfile.s15.decidedAt', {
              date: formatHistoryDate(entry.decidedAt),
            })}`
          : null}
      </p>
      {entry.status === 'rejected' && entry.decisionReason ? (
        <p className="mt-2 text-muted-foreground">
          {t('employeeProfile.s15.reason', { reason: entry.decisionReason })}
        </p>
      ) : null}
    </li>
  )
}
