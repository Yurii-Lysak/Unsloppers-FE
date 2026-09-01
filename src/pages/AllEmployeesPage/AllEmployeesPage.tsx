import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEmployeeList } from '@/api/hooks/useEmployeeList'
import { Button } from '@/components/ui/button'
import { EmployeeTable } from './components/EmployeeTable/EmployeeTable'
import { ColumnPicker } from './components/ColumnPicker/ColumnPicker'
import { useAllEmployeesPage } from './hooks/useAllEmployeesPage'

export const AllEmployeesPage = () => {
  const { t } = useTranslation()
  const {
    query,
    setPage,
    toggleSort,
    upsertFilter,
    clearFilter,
    clearAllFilters,
    activeFilterForField,
    visibleColumnIds,
    setVisibleColumnIds,
    parseColumnIds,
  } = useAllEmployeesPage()
  const listQuery = useEmployeeList(query)

  const shownCount = listQuery.data?.rows.length ?? 0
  const totalCount = listQuery.data?.total ?? 0
  const page = listQuery.data?.page ?? query.page ?? 1
  const pageSize = listQuery.data?.pageSize ?? query.pageSize ?? 50
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const allFields = listQuery.data?.fields ?? []
  const selectedColumnIds = parseColumnIds(
    visibleColumnIds,
    allFields.map(field => field.id),
  )
  const displayData =
    listQuery.data &&
    ({
      ...listQuery.data,
      fields: allFields.filter(field => selectedColumnIds.includes(field.id)),
      rows: listQuery.data.rows.map(row => ({
        employeeId: row.employeeId,
        cells: Object.fromEntries(
          selectedColumnIds
            .filter(fieldId => fieldId in row.cells)
            .map(fieldId => [fieldId, row.cells[fieldId]]),
        ),
      })),
    } as typeof listQuery.data)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground" data-testid="directory-title">
            {t('directory.title')}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground" data-testid="directory-count">
          {t('directory.count', { shown: shownCount, total: totalCount })}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={clearAllFilters}
            disabled={(query.filters?.length ?? 0) === 0}
            data-testid="directory-clear-filters"
          >
            {t('directory.clearAllFilters')}
          </Button>
          {listQuery.data && (
            <ColumnPicker
              fields={allFields}
              selectedColumnIds={selectedColumnIds}
              onChange={setVisibleColumnIds}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1 || listQuery.isLoading}
            onClick={() => setPage(page - 1)}
            data-testid="directory-prev-page"
          >
            {t('directory.previousPage')}
          </Button>
          <span className="text-sm text-muted-foreground" data-testid="directory-page-indicator">
            {t('directory.pageIndicator', { page, totalPages })}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={page >= totalPages || listQuery.isLoading}
            onClick={() => setPage(page + 1)}
            data-testid="directory-next-page"
          >
            {t('directory.nextPage')}
          </Button>
        </div>
      </div>

      {listQuery.isLoading && (
        <p className="text-muted-foreground">{t('directory.loading')}</p>
      )}

      {listQuery.isError && (
        <p className="text-destructive">{t('directory.loadFailed')}</p>
      )}

      {displayData && (
        <EmployeeTable
          data={displayData}
          sort={query.sort}
          order={query.order}
          onToggleSort={toggleSort}
          onApplyFilter={upsertFilter}
          onClearFilter={clearFilter}
          activeFilterForField={activeFilterForField}
        />
      )}
    </div>
  )
}
