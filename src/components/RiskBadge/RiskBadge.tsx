import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/types/employee-profile'
import { riskLevelClassName, riskLevelLabelKey } from './risk-level-styles'

interface RiskBadgeProps {
  level: RiskLevel
  className?: string
}

export const RiskBadge = ({ level, className }: RiskBadgeProps) => {
  const { t } = useTranslation()

  return (
    <Badge className={cn(riskLevelClassName[level], className)}>
      {t(riskLevelLabelKey(level))}
    </Badge>
  )
}
