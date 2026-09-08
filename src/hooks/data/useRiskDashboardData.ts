import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  useRiskDashboard,
  useRiskDashboardAccess,
} from '@/api/hooks/useRiskDashboard'
import type { RiskDashboardQuery, RiskLevel } from '@/types/risk-dashboard'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 50

const isRiskLevel = (value: string | null): value is RiskLevel =>
  value === 'low' ||
  value === 'need_attention' ||
  value === 'medium' ||
  value === 'high' ||
  value === 'leaver'

const parsePage = (raw: string | null): number => {
  const parsed = Number(raw)
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : DEFAULT_PAGE
}

export const useRiskDashboardData = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = useMemo<RiskDashboardQuery>(() => {
    const levelParam = searchParams.get('level')
    const level = isRiskLevel(levelParam) ? levelParam : undefined
    return {
      level,
      departmentId: searchParams.get('departmentId') ?? undefined,
      managerId: searchParams.get('managerId') ?? undefined,
      peoplePartnerId: searchParams.get('peoplePartnerId') ?? undefined,
      projectId: searchParams.get('projectId') ?? undefined,
      page: parsePage(searchParams.get('page')),
      pageSize: DEFAULT_PAGE_SIZE,
    }
  }, [searchParams])

  const accessQuery = useRiskDashboardAccess()
  const dashboardQuery = useRiskDashboard(
    query,
    accessQuery.data?.canAccess === true,
  )

  const setLevelFilter = useCallback(
    (level?: RiskLevel) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        if (level) {
          next.set('level', level)
        } else {
          next.delete('level')
        }
        next.set('page', String(DEFAULT_PAGE))
        return next
      })
    },
    [setSearchParams],
  )

  const setFilter = useCallback(
    (key: 'departmentId' | 'managerId' | 'peoplePartnerId' | 'projectId', value?: string) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        if (value) {
          next.set(key, value)
        } else {
          next.delete(key)
        }
        next.set('page', String(DEFAULT_PAGE))
        return next
      })
    },
    [setSearchParams],
  )

  const clearAllFilters = useCallback(() => {
    setSearchParams({})
  }, [setSearchParams])

  const setPage = useCallback(
    (page: number) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        next.set('page', String(page))
        return next
      })
    },
    [setSearchParams],
  )

  const totalPages = dashboardQuery.data
    ? Math.max(1, Math.ceil(dashboardQuery.data.total / dashboardQuery.data.pageSize))
    : 1

  return {
    query,
    accessQuery,
    dashboardQuery,
    setLevelFilter,
    setFilter,
    clearAllFilters,
    setPage,
    totalPages,
    canAccess: accessQuery.data?.canAccess === true,
    isAccessLoading: accessQuery.isLoading,
    isDashboardLoading: dashboardQuery.isLoading,
    isDashboardError: dashboardQuery.isError,
    dashboard: dashboardQuery.data,
  }
}

export const useRiskDashboardNavAccess = () => {
  const { data, isSuccess } = useRiskDashboardAccess()
  return {
    showRiskDashboard: isSuccess && data.canAccess,
  }
}
