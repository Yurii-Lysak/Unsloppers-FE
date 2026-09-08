import { useMemo } from 'react'
import { useDashboardData } from '@/hooks/data/useDashboardData'

export const useDashboardPage = () => {
  const {
    configQuery,
    summaryQuery,
    actionItemsQuery,
    configForbidden,
    isLoading,
    isError,
  } = useDashboardData()

  const actionItems = useMemo(() => {
    const items = actionItemsQuery.data ?? []
    return [...items].sort((left, right) => left.dueDate.localeCompare(right.dueDate))
  }, [actionItemsQuery.data])

  return {
    configForbidden,
    isLoading,
    isError,
    config: configQuery.data,
    summary: summaryQuery.data,
    actionItems,
  }
}
