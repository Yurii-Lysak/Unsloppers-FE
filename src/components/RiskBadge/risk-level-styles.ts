import type { RiskLevel } from '@/types/employee-profile'

export const riskLevelClassName: Record<RiskLevel, string> = {
  low: 'bg-risk-low text-risk-low-foreground',
  need_attention: 'bg-risk-attention text-risk-attention-foreground',
  medium: 'bg-risk-medium text-risk-medium-foreground',
  high: 'bg-risk-high text-risk-high-foreground',
  leaver: 'bg-risk-leaver text-risk-leaver-foreground',
}

export const riskLevelTextClassName: Record<RiskLevel, string> = {
  low: 'text-risk-low',
  need_attention: 'text-risk-attention',
  medium: 'text-risk-medium',
  high: 'text-risk-high',
  leaver: 'text-risk-leaver',
}

export const riskLevelLabelKey = (level: RiskLevel): string =>
  `employeeProfile.s6.levels.${level}`
