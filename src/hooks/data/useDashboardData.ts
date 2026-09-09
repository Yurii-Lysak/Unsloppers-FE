import {
  useAuthoredActionItems,
  useDashboardConfig,
  useDashboardSummary,
} from '@/api/hooks/useDashboard'
import type { DashboardSummaryQuery } from '@/api/services/dashboard.service'

export const useDashboardData = (summaryParams: DashboardSummaryQuery = {}) => {
  const configQuery = useDashboardConfig()
  const configLoaded = configQuery.isSuccess
  const configForbidden =
    configQuery.isError &&
    (configQuery.error as { response?: { status?: number } })?.response?.status === 403

  const isUmPeopleDashboard =
    configLoaded &&
    configQuery.data.variant === 'um' &&
    configQuery.data.grouping === 'people'

  const isDmProjectDashboard =
    configLoaded &&
    configQuery.data.variant === 'dm' &&
    configQuery.data.grouping === 'project'

  const summaryQueryParams = isUmPeopleDashboard
    ? summaryParams
    : isDmProjectDashboard
      ? { projectId: summaryParams.projectId }
      : {}
  const summaryQuery = useDashboardSummary(configLoaded, summaryQueryParams)
  const showOwnActionItems =
    configLoaded && configQuery.data.blocks.includes('ownActionItems')
  const actionItemsQuery = useAuthoredActionItems(showOwnActionItems)

  return {
    configQuery,
    summaryQuery,
    actionItemsQuery,
    configForbidden,
    isError:
      (configQuery.isError && !configForbidden) ||
      (configLoaded && summaryQuery.isError),
  }
}
