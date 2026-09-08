import {
  useAuthoredActionItems,
  useDashboardConfig,
  useDashboardSummary,
} from '@/api/hooks/useDashboard'

export const useDashboardData = () => {
  const configQuery = useDashboardConfig()
  const configLoaded = configQuery.isSuccess
  const configForbidden =
    configQuery.isError &&
    (configQuery.error as { response?: { status?: number } })?.response?.status === 403

  const summaryQuery = useDashboardSummary(configLoaded)
  const showOwnActionItems =
    configLoaded && configQuery.data.blocks.includes('ownActionItems')
  const actionItemsQuery = useAuthoredActionItems(showOwnActionItems)

  return {
    configQuery,
    summaryQuery,
    actionItemsQuery,
    configForbidden,
    isLoading: configQuery.isLoading || (configLoaded && summaryQuery.isLoading),
    isError:
      (configQuery.isError && !configForbidden) ||
      (configLoaded && summaryQuery.isError),
  }
}
