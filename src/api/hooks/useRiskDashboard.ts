import { useQuery } from '@tanstack/react-query'
import { riskApiService } from '@/api/services/risk.service'
import type { RiskDashboardQuery } from '@/types/risk-dashboard'

export const riskDashboardAccessQueryKey = ['risks', 'dashboard', 'access'] as const

export const riskDashboardQueryKey = (query: RiskDashboardQuery) =>
  ['risks', 'dashboard', query] as const

export const useRiskDashboardAccess = (enabled = true) =>
  useQuery({
    queryKey: riskDashboardAccessQueryKey,
    queryFn: () => riskApiService.getDashboardAccess(),
    enabled,
  })

export const useRiskDashboard = (
  query: RiskDashboardQuery,
  enabled = true,
) =>
  useQuery({
    queryKey: riskDashboardQueryKey(query),
    queryFn: () => riskApiService.getDashboard(query),
    enabled,
  })
