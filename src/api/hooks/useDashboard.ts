import { useQuery } from '@tanstack/react-query'
import {
  dashboardApiService,
  type DashboardSummaryQuery,
} from '@/api/services/dashboard.service'

export const dashboardConfigQueryKey = ['dashboards', 'config'] as const

export const dashboardSummaryQueryKey = (query: DashboardSummaryQuery = {}) =>
  ['dashboards', 'summary', query] as const

export const authoredActionItemsQueryKey = ['me', 'authored-action-items'] as const

export const useDashboardConfig = (enabled = true) =>
  useQuery({
    queryKey: dashboardConfigQueryKey,
    queryFn: () => dashboardApiService.getConfig(),
    enabled,
    retry: false,
  })

export const useDashboardSummary = (
  enabled = true,
  query: DashboardSummaryQuery = {},
) =>
  useQuery({
    queryKey: dashboardSummaryQueryKey(query),
    queryFn: () => dashboardApiService.getSummary(query),
    enabled,
    retry: false,
  })

export const useAuthoredActionItems = (enabled = true) =>
  useQuery({
    queryKey: authoredActionItemsQueryKey,
    queryFn: () => dashboardApiService.getAuthoredActionItems(),
    enabled,
  })
