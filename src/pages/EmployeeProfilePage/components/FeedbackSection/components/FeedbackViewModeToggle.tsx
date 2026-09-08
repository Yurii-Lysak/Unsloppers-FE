import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import type { FeedbackViewMode } from '../hooks/useFeedbackViewMode'

interface FeedbackViewModeToggleProps {
  viewMode: FeedbackViewMode
  onSelectList: () => void
  onSelectCompare: () => void
}

export const FeedbackViewModeToggle = ({
  viewMode,
  onSelectList,
  onSelectCompare,
}: FeedbackViewModeToggleProps) => {
  const { t } = useTranslation()

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label={t('employeeProfile.s8.viewMode.groupLabel')}
      data-testid="feedback-view-mode-toggle"
    >
      <Button
        type="button"
        size="sm"
        variant={viewMode === 'list' ? 'default' : 'outline'}
        onClick={onSelectList}
        data-testid="feedback-view-mode-list"
      >
        {t('employeeProfile.s8.viewMode.list')}
      </Button>
      <Button
        type="button"
        size="sm"
        variant={viewMode === 'compare' ? 'default' : 'outline'}
        onClick={onSelectCompare}
        data-testid="feedback-view-mode-compare"
      >
        {t('employeeProfile.s8.viewMode.compare')}
      </Button>
    </div>
  )
}
