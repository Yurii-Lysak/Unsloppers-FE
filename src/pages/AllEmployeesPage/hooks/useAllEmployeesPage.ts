import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import {
  useEmployeeLeaveCellsData,
  useEmployeesListData,
  useUpdateEmployeeFieldData,
} from '@/hooks/data/useEmployeesData'
import { BUILTIN_FIELD_IDS } from '@/types/employees'
import type {
  EmployeeFieldFilter,
  EmployeeListQuery,
  EmployeeListResponse,
  SortOrder,
} from '@/types/employees'
import type { CreateSavedViewInput, SavedView } from '@/types/saved-views'
import { parseDirectoryFilters } from '../utils/directory-query-parsing'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 50
export const MAX_PAGE_SIZE = 100

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
    writableFieldIds: row.writableFieldIds?.filter(fieldId =>
      selectedColumnIds.includes(fieldId),
    ),
    cells: Object.fromEntries(
      selectedColumnIds
        .filter(fieldId => fieldId in row.cells)
        .map(fieldId => [fieldId, row.cells[fieldId]]),
    ),
  })),
})

/**
 * Overlays the leave-dates column with a fetched-separately value: the main
 * list response always leaves it `null` (see EmployeesService.
 * enrichIntegratedFields) so the page can render immediately without
 * blocking on TimeTracker. Text is embedded directly into the cell here
 * rather than threaded through EmployeeTable/EmployeeCardList as extra
 * props — both already render whatever string a cell holds as-is.
 */
const overlayLeaveDatesColumn = (
  displayData: EmployeeListResponse,
  leaveCellsState: {
    leaveCells: Record<string, { value: string; unavailable: boolean }> | undefined
    isLeaveCellsLoading: boolean
    isLeaveCellsError: boolean
  },
  t: (key: string) => string,
): EmployeeListResponse => {
  const fieldId = BUILTIN_FIELD_IDS.current_leave_dates
  if (!displayData.fields.some(field => field.id === fieldId)) {
    return displayData
  }

  const { leaveCells, isLeaveCellsLoading, isLeaveCellsError } = leaveCellsState

  return {
    ...displayData,
    rows: displayData.rows.map(row => {
      if (!(fieldId in row.cells)) {
        return row
      }
      let value: string | null
      if (isLeaveCellsLoading || !leaveCells) {
        value = t('directory.cellLoading')
      } else if (isLeaveCellsError) {
        value = t('directory.cellUnavailable')
      } else {
        const cell = leaveCells[row.employeeId]
        value = cell ? (cell.unavailable ? t('directory.cellUnavailable') : cell.value) : null
      }
      return { ...row, cells: { ...row.cells, [fieldId]: value } }
    }),
  }
}

export const useAllEmployeesPage = () => {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const query = useMemo<EmployeeListQuery>(() => {
    const page = Number(searchParams.get('page') ?? DEFAULT_PAGE)
    const pageSize = Number(searchParams.get('pageSize') ?? DEFAULT_PAGE_SIZE)
    const sort = searchParams.get('sort') ?? undefined
    const order = parseSortOrder(searchParams.get('order'))
    const filters = parseDirectoryFilters(searchParams.get('filters'))

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

  const activeViewId = searchParams.get('view')

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
      const filters = parseDirectoryFilters(searchParams.get('filters')).filter(
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
      const filters = parseDirectoryFilters(searchParams.get('filters')).filter(
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
      parseDirectoryFilters(searchParams.get('filters')).find(
        entry => entry.fieldId === fieldId,
      ),
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

  const selectAllTab = useCallback(() => {
    updateParams({
      view: undefined,
      filters: undefined,
      columns: undefined,
      sort: undefined,
      order: undefined,
      page: '1',
    })
  }, [updateParams])

  const applySavedView = useCallback(
    (view: SavedView) => {
      updateParams({
        view: view.id,
        filters:
          view.filters.length > 0 ? JSON.stringify(view.filters) : undefined,
        columns:
          view.columnIds.length > 0 ? JSON.stringify(view.columnIds) : undefined,
        sort: view.sort,
        order: view.order,
        page: '1',
      })
    },
    [updateParams],
  )

  const getCurrentViewConfig = useCallback(
    (columnIds: string[]): CreateSavedViewInput => ({
      name: '',
      filters: parseDirectoryFilters(searchParams.get('filters')),
      columnIds,
      sort: searchParams.get('sort') ?? undefined,
      order: parseSortOrder(searchParams.get('order')),
    }),
    [searchParams],
  )

  const selectedColumnIds = useCallback(
    (allFieldIds: string[]) =>
      parseColumnIds(searchParams.get('columns'), allFieldIds),
    [searchParams],
  )

  const { employeesList, isEmployeesLoading, isEmployeesError } =
    useEmployeesListData(query)
  const { saveEmployeeField, isSavingField } = useUpdateEmployeeFieldData(query)

  const allFields = employeesList?.fields ?? []
  const entitledFieldIds = allFields.map(field => field.id)
  const requestedColumnIds = selectedColumnIds(entitledFieldIds)
  const sanitizedColumnIds = requestedColumnIds.filter(id => entitledFieldIds.includes(id))
  const visibleColumnIds =
    sanitizedColumnIds.length > 0 ? sanitizedColumnIds : entitledFieldIds
  const baseDisplayData = employeesList
    ? buildDirectoryDisplayData(employeesList, visibleColumnIds)
    : undefined

  const wantsLeaveColumn =
    baseDisplayData?.fields.some(field => field.id === BUILTIN_FIELD_IDS.current_leave_dates) ??
    false
  const leaveCellEmployeeIds = wantsLeaveColumn
    ? (baseDisplayData?.rows.map(row => row.employeeId) ?? [])
    : []
  const { leaveCells, isLeaveCellsLoading, isLeaveCellsError } = useEmployeeLeaveCellsData(
    leaveCellEmployeeIds,
    wantsLeaveColumn,
  )
  const displayData = baseDisplayData
    ? overlayLeaveDatesColumn(
        baseDisplayData,
        { leaveCells, isLeaveCellsLoading, isLeaveCellsError },
        t,
      )
    : undefined

  const shownCount = employeesList?.rows.length ?? 0
  const totalCount = employeesList?.total ?? 0
  const page = employeesList?.page ?? query.page ?? 1
  const pageSize = Math.max(
    1,
    employeesList?.pageSize ?? query.pageSize ?? DEFAULT_PAGE_SIZE,
  )
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return {
    query,
    activeViewId,
    setPage,
    toggleSort,
    upsertFilter,
    clearFilter,
    clearAllFilters,
    activeFilterForField,
    setVisibleColumnIds,
    selectAllTab,
    applySavedView,
    getCurrentViewConfig,
    employeesList,
    isEmployeesLoading,
    isEmployeesError,
    displayData,
    shownCount,
    totalCount,
    page,
    pageSize,
    totalPages,
    allFields,
    visibleColumnIds,
    saveEmployeeField,
    isSavingField,
  }
}

