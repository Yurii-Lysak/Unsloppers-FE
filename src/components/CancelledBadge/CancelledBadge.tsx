import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CancelledBadgeProps {
  className?: string
}

export const CancelledBadge = ({ className }: CancelledBadgeProps) => {
  const { t } = useTranslation()

  return (
    <Badge variant="secondary" className={cn('text-muted-foreground', className)}>
      {t('campaigns.completion.cancelled')}
    </Badge>
  )
}
