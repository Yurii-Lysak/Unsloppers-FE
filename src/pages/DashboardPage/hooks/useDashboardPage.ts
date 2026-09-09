import { useMemo, useState } from 'react'
import { useDashboardData } from '@/hooks/data/useDashboardData'

const DEFAULT_PAGE_SIZE = 50

export const useDashboardPage = () => {
  const [page, setPage] = useState(1)
  const summaryQueryParams = useMemo(
    () => ({ page, pageSize: DEFAULT_PAGE_SIZE }),
    [page],
  )

  const {
    configQuery,
    summaryQuery,
    actionItemsQuery,
    configForbidden,
    isLoading,
    isError,
  } = useDashboardData(summaryQueryParams)

  const actionItems = useMemo(() => {
    const items = actionItemsQuery.data ?? []
    return [...items].sort((left, right) => left.dueDate.localeCompare(right.dueDate))
  }, [actionItemsQuery.data])

  const totalPages = useMemo(() => {
    const totalRows = summaryQuery.data?.pagination?.totalRows ?? 0
    const pageSize = summaryQuery.data?.pagination?.pageSize ?? DEFAULT_PAGE_SIZE
    return Math.max(1, Math.ceil(totalRows / pageSize))
  }, [summaryQuery.data?.pagination])

  return {
    configForbidden,
    isLoading,
    isError,
    config: configQuery.data,
    summary: summaryQuery.data,
    actionItems,
    page,
    totalPages,
    setPage,
  }
}
