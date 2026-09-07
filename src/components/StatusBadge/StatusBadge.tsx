import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  className?: string
}

export const StatusBadge = ({ className }: StatusBadgeProps) => {
  const { t } = useTranslation()

  return (
    <Badge className={cn('bg-success text-success-foreground', className)}>
      {t('campaigns.completion.completed')}
    </Badge>
  )
}
