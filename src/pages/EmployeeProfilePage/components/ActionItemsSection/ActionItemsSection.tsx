import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { OverdueIndicator } from '@/components/OverdueIndicator/OverdueIndicator'
import type {
  ActionItem,
  ActionItemsSection as ActionItemsSectionData,
  ProfileSectionEnvelope,
  SectionAccessLevel,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'
import { useActionItemsSection } from './hooks/useActionItemsSection'

interface ActionItemsSectionCardProps {
  employeeId: string
  section: ProfileSectionEnvelope<ActionItemsSectionData>
  accessLevel: Exclude<SectionAccessLevel, 'none'>
}

const formatDisplayDate = (value: string): string => {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
  const parsed = isDateOnly
    ? new Date(`${value}T00:00:00.000Z`)
    : new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }
  return parsed.toLocaleDateString(
    undefined,
    isDateOnly ? { timeZone: 'UTC' } : undefined,
  )
}

export const ActionItemsSectionCard = ({
  employeeId,
  section,
  accessLevel,
}: ActionItemsSectionCardProps) => {
  const { t } = useTranslation()
  const { completeItem, pendingItemId } = useActionItemsSection(employeeId)

  if (!isSectionData<ActionItemsSectionData>(section)) {
    return null
  }

  const { items } = section.data
  const canComplete = accessLevel !== 'RW'

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="action-items-section">
        {t('employeeProfile.s14.empty')}
      </p>
    )
  }

  return (
    <ul className="space-y-3" data-testid="action-items-section">
      {items.map(item => (
        <ActionItemRow
          key={item.id}
          item={item}
          canComplete={canComplete}
          isCompleting={pendingItemId === item.id}
          onComplete={() => {
            void completeItem(item.id)
          }}
        />
      ))}
    </ul>
  )
}

const ActionItemRow = ({
  item,
  canComplete,
  isCompleting,
  onComplete,
}: {
  item: ActionItem
  canComplete: boolean
  isCompleting: boolean
  onComplete: () => void
}) => {
  const { t } = useTranslation()

  return (
    <li
      className="rounded-md border border-border p-3 text-sm"
      data-testid={`action-item-${item.id}`}
    >
      <p className="font-medium text-foreground">{item.title}</p>
      {item.description ? (
        <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
          {item.description}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>
          {t('employeeProfile.s14.dueDate', {
            date: formatDisplayDate(item.dueDate),
          })}
        </span>
        {item.status === 'open' && item.isOverdue ? (
          <OverdueIndicator dueDate={item.dueDate} />
        ) : null}
      </div>
      {item.link ? (
        <a
          href={item.link}
          className="mt-2 inline-block text-primary underline"
          target="_blank"
          rel="noreferrer"
          data-testid={`action-item-${item.id}-link`}
        >
          {item.link}
        </a>
      ) : null}
      {item.status === 'completed' && item.completedAt ? (
        <p className="mt-2 text-xs text-muted-foreground">
          {t('employeeProfile.s14.completedOn', {
            date: formatDisplayDate(item.completedAt),
          })}
        </p>
      ) : null}
      {item.status === 'cancelled' ? (
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <p>{t('employeeProfile.s14.cancelled')}</p>
          {item.cancelledAt ? (
            <p>
              {t('employeeProfile.s14.cancelledOn', {
                date: formatDisplayDate(item.cancelledAt),
              })}
            </p>
          ) : null}
          {item.cancelledReason ? (
            <p>
              {t('employeeProfile.s14.cancelledReason', {
                reason: item.cancelledReason,
              })}
            </p>
          ) : null}
        </div>
      ) : null}
      {canComplete && item.status === 'open' ? (
        <Button
          type="button"
          size="sm"
          className="mt-3"
          disabled={isCompleting}
          onClick={onComplete}
          data-testid={`action-item-${item.id}-complete`}
        >
          {t('employeeProfile.s14.markComplete')}
        </Button>
      ) : null}
    </li>
  )
}
