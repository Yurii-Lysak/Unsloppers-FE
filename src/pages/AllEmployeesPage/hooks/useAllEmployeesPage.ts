import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type {
  EmployeeFieldFilter,
  EmployeeListQuery,
  EmployeeListResponse,
  FilterOperator,
  SortOrder,
} from '@/types/employees'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 50
export const MAX_PAGE_SIZE = 100

const FILTER_OPERATORS: FilterOperator[] = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'contains',
  'in',
]

const isFilterOperator = (value: unknown): value is FilterOperator =>
  typeof value === 'string' && FILTER_OPERATORS.includes(value as FilterOperator)

const isEmployeeFieldFilter = (value: unknown): value is EmployeeFieldFilter => {
  if (!value || typeof value !== 'object') {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.fieldId === 'string' &&
    isFilterOperator(candidate.operator) &&
    (typeof candidate.value === 'string' ||
      typeof candidate.value === 'number' ||
      typeof candidate.value === 'boolean' ||
      candidate.value === null ||
      (Array.isArray(candidate.value) &&
        candidate.value.every(entry => typeof entry === 'string')))
  )
}

const parseFilters = (raw: string | null): EmployeeFieldFilter[] => {
  if (!raw) {
    return []
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isEmployeeFieldFilter)
  } catch {
    return []
  }
}

const parseColumnIds = (raw: string | null, fallback: string[]): string[] => {
  if (!raw) {
    return fallback
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.some(entry => typeof entry !== 'string')) {
      return fallback
    }
    return parsed
  } catch {
    return fallback
  }
}

const parseSortOrder = (raw: string | null): SortOrder | undefined => {
  if (raw === 'asc' || raw === 'desc') {
    return raw
  }
  return undefined
}

export const buildDirectoryDisplayData = (
  listData: EmployeeListResponse,
  selectedColumnIds: string[],
): EmployeeListResponse => ({
  ...listData,
  fields: listData.fields.filter(field => selectedColumnIds.includes(field.id)),
  rows: listData.rows.map(row => ({
    employeeId: row.employeeId,
    cells: Object.fromEntries(
      selectedColumnIds
        .filter(fieldId => fieldId in row.cells)
        .map(fieldId => [fieldId, row.cells[fieldId]]),
    ),
  })),
})

export const useAllEmployeesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = useMemo<EmployeeListQuery>(() => {
    const page = Number(searchParams.get('page') ?? DEFAULT_PAGE)
    const pageSize = Number(searchParams.get('pageSize') ?? DEFAULT_PAGE_SIZE)
    const sort = searchParams.get('sort') ?? undefined
    const order = parseSortOrder(searchParams.get('order'))
    const filters = parseFilters(searchParams.get('filters'))

    return {
      page: Number.isFinite(page) && page > 0 ? page : DEFAULT_PAGE,
      pageSize:
        Number.isFinite(pageSize) && pageSize > 0
          ? Math.min(pageSize, MAX_PAGE_SIZE)
          : DEFAULT_PAGE_SIZE,
      sort,
      order,
      filters,
    }
  }, [searchParams])

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(updates)) {
          if (value === undefined || value === '') {
            next.delete(key)
          } else {
            next.set(key, value)
          }
        }
        return next
      })
    },
    [setSearchParams],
  )

  const setPage = useCallback(
    (page: number) => {
      updateParams({ page: String(page) })
    },
    [updateParams],
  )

  const toggleSort = useCallback(
    (fieldId: string) => {
      const currentSort = searchParams.get('sort')
      const currentOrder = searchParams.get('order') ?? 'asc'
      if (currentSort !== fieldId) {
        updateParams({ sort: fieldId, order: 'asc', page: '1' })
        return
      }
      if (currentOrder === 'asc') {
        updateParams({ sort: fieldId, order: 'desc', page: '1' })
        return
      }
      updateParams({ sort: undefined, order: undefined, page: '1' })
    },
    [searchParams, updateParams],
  )

  const upsertFilter = useCallback(
    (filter: EmployeeFieldFilter) => {
      const filters = parseFilters(searchParams.get('filters')).filter(
        entry => entry.fieldId !== filter.fieldId,
      )
      filters.push(filter)
      updateParams({
        filters: filters.length > 0 ? JSON.stringify(filters) : undefined,
        page: '1',
      })
    },
    [searchParams, updateParams],
  )

  const clearFilter = useCallback(
    (fieldId: string) => {
      const filters = parseFilters(searchParams.get('filters')).filter(
        entry => entry.fieldId !== fieldId,
      )
      updateParams({
        filters: filters.length > 0 ? JSON.stringify(filters) : undefined,
        page: '1',
      })
    },
    [searchParams, updateParams],
  )

  const clearAllFilters = useCallback(() => {
    updateParams({ filters: undefined, page: '1' })
  }, [updateParams])

  const activeFilterForField = useCallback(
    (fieldId: string) =>
      parseFilters(searchParams.get('filters')).find(entry => entry.fieldId === fieldId),
    [searchParams],
  )

  const setVisibleColumnIds = useCallback(
    (columnIds: string[]) => {
      updateParams({
        columns: columnIds.length > 0 ? JSON.stringify(columnIds) : undefined,
      })
    },
    [updateParams],
  )

  const selectedColumnIds = useCallback(
    (allFieldIds: string[]) =>
      parseColumnIds(searchParams.get('columns'), allFieldIds),
    [searchParams],
  )

  const buildDisplayData = useCallback(
    (listData: EmployeeListResponse) => {
      const visibleIds = selectedColumnIds(listData.fields.map(field => field.id))
      return buildDirectoryDisplayData(listData, visibleIds)
    },
    [selectedColumnIds],
  )

  return {
    query,
    setPage,
    toggleSort,
    upsertFilter,
    clearFilter,
    clearAllFilters,
    activeFilterForField,
    visibleColumnIds: searchParams.get('columns'),
    setVisibleColumnIds,
    parseColumnIds,
    selectedColumnIds,
    buildDisplayData,
  }
}

export const defaultFilterOperatorForType = (
  type: string,
): FilterOperator => {
  if (type === 'number') {
    return 'eq'
  }
  if (type === 'boolean') {
    return 'eq'
  }
  if (type === 'multi_select') {
    return 'in'
  }
  if (type === 'select') {
    return 'eq'
  }
  return 'contains'
}

export const formatCellValue = (
  value: unknown,
  t: (key: string) => string,
): string => {
  if (value === null || value === undefined) {
    return t('directory.cellEmpty')
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'boolean') {
    return value ? t('directory.boolean.true') : t('directory.boolean.false')
  }
  return String(value)
}
