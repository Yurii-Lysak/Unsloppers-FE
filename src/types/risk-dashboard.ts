import type { RiskLevel } from './employee-profile'
import type { RiskTrend } from '@/components/TrendArrow/TrendArrow'

export type { RiskLevel }

export interface RiskDashboardCounts {
  need_attention: number
  medium: number
  high: number
  leaver: number
  totalActive: number
}

export interface RiskDashboardRow {
  employeeId: string
  displayName: string
  currentLevel: RiskLevel
  trend?: RiskTrend
  recordedAt: string
  department?: string
  managerName?: string
  peoplePartnerName?: string
}

export interface RiskDashboardResponse {
  counts: RiskDashboardCounts
  rows: RiskDashboardRow[]
  total: number
  page: number
  pageSize: number
}

export interface RiskDashboardAccessResponse {
  canAccess: boolean
}

export type RiskDashboardLevelFilter = RiskLevel | 'all'

export interface RiskDashboardQuery {
  level?: RiskLevel
  departmentId?: string
  managerId?: string
  peoplePartnerId?: string
  projectId?: string
  page?: number
  pageSize?: number
}

export const RISK_DASHBOARD_COUNTER_LEVELS = [
  'need_attention',
  'medium',
  'high',
  'leaver',
] as const satisfies readonly RiskLevel[]
