import { useTranslation } from 'react-i18next'
import { OverdueIndicator } from '@/components/OverdueIndicator/OverdueIndicator'
import type { AuthoredActionItem } from '@/types/dashboard'

interface OwnActionItemsWidgetProps {
  items: AuthoredActionItem[]
}

export const OwnActionItemsWidget = ({ items }: OwnActionItemsWidgetProps) => {
  const { t } = useTranslation()

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="dashboard-action-items-empty">
        {t('dashboard.actionItems.empty')}
      </p>
    )
  }

  return (
    <div className="divide-y divide-border" data-testid="dashboard-action-items">
      {items.map(item => (
        <div
          key={item.id}
          className={item.isOverdue ? 'border-l-[3px] border-destructive pl-3' : undefined}
          data-testid={`dashboard-action-item-${item.id}`}
        >
          <div className="flex flex-col gap-1 py-3 first:pt-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {t('dashboard.actionItems.assignee', {
                    name: item.assignee.displayName,
                  })}
                </p>
              </div>
              {item.isOverdue ? <OverdueIndicator dueDate={item.dueDate} /> : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
