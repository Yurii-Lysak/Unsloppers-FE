import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface OverdueIndicatorProps {
  dueDate: string
  className?: string
}

const formatDueDateLabel = (dueDate: string, locale: string): string => {
  const parsed = new Date(`${dueDate}T00:00:00.000Z`)
  return parsed.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export const OverdueIndicator = ({ dueDate, className }: OverdueIndicatorProps) => {
  const { t, i18n } = useTranslation()

  return (
    <span
      className={cn(
        'inline-flex items-center border-l-[3px] border-destructive pl-2 text-sm text-destructive',
        className,
      )}
    >
      {t('campaigns.completion.overdue', {
        dueDate: formatDueDateLabel(dueDate, i18n.language),
      })}
    </span>
  )
}
