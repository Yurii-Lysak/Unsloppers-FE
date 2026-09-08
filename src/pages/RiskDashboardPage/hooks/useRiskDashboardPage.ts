import { useRiskDashboardData } from '@/hooks/data/useRiskDashboardData'

export const useRiskDashboardPage = () => {
  const {
    query,
    canAccess,
    isAccessLoading,
    isDashboardLoading,
    isDashboardError,
    dashboard,
    setLevelFilter,
    clearAllFilters,
    setPage,
    totalPages,
  } = useRiskDashboardData()

  const hasActiveFilters = Boolean(
    query.level ||
      query.departmentId ||
      query.managerId ||
      query.peoplePartnerId ||
      query.projectId,
  )

  return {
    query,
    canAccess,
    isAccessLoading,
    isDashboardLoading,
    isDashboardError,
    dashboard,
    setLevelFilter,
    clearAllFilters,
    setPage,
    totalPages,
    hasActiveFilters,
  }
}
