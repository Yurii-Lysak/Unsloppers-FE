import { useQuery } from '@tanstack/react-query'
import { dashboardApiService } from '@/api/services/dashboard.service'

export const dashboardConfigQueryKey = ['dashboards', 'config'] as const

export const dashboardSummaryQueryKey = ['dashboards', 'summary'] as const

export const authoredActionItemsQueryKey = ['me', 'authored-action-items'] as const

export const useDashboardConfig = (enabled = true) =>
  useQuery({
    queryKey: dashboardConfigQueryKey,
    queryFn: () => dashboardApiService.getConfig(),
    enabled,
    retry: false,
  })

export const useDashboardSummary = (enabled = true) =>
  useQuery({
    queryKey: dashboardSummaryQueryKey,
    queryFn: () => dashboardApiService.getSummary(),
    enabled,
    retry: false,
  })

export const useAuthoredActionItems = (enabled = true) =>
  useQuery({
    queryKey: authoredActionItemsQueryKey,
    queryFn: () => dashboardApiService.getAuthoredActionItems(),
    enabled,
  })
