import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { riskLevelTextClassName } from '@/components/RiskBadge/risk-level-styles'
import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/types/employee-profile'

export type RiskTrend = 'up' | 'down' | 'flat'

interface TrendArrowProps {
  trend?: RiskTrend
  level: RiskLevel
  className?: string
}

export const TrendArrow = ({ trend, level, className }: TrendArrowProps) => {
  const { t } = useTranslation()

  if (trend !== 'up' && trend !== 'down') {
    return null
  }

  const Icon = trend === 'up' ? ChevronUp : ChevronDown
  const ariaLabel =
    trend === 'up'
      ? t('employeeProfile.s6.trend.worsening')
      : t('employeeProfile.s6.trend.improving')

  return (
    <Icon
      role="img"
      aria-label={ariaLabel}
      className={cn(
        'size-4 shrink-0',
        trend === 'up' ? riskLevelTextClassName[level] : 'text-success',
        className,
      )}
      data-testid={`risk-trend-${trend}`}
    />
  )
}
