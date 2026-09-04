import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
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
    setVisibleColumnIds,
    isEmployeesLoading,
    isEmployeesError,
    employeesList,
    displayData,
    shownCount,
    totalCount,
    page,
    totalPages,
    allFields,
    visibleColumnIds,
    saveEmployeeField,
    isSavingField,
  } = useAllEmployeesPage()

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
          {employeesList && (
            <ColumnPicker
              fields={allFields}
              selectedColumnIds={visibleColumnIds}
              onChange={setVisibleColumnIds}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1 || isEmployeesLoading}
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
            disabled={page >= totalPages || isEmployeesLoading}
            onClick={() => setPage(page + 1)}
            data-testid="directory-next-page"
          >
            {t('directory.nextPage')}
          </Button>
        </div>
      </div>

      {isEmployeesLoading && (
        <p className="text-muted-foreground">{t('directory.loading')}</p>
      )}

      {isEmployeesError && (
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
          onSaveField={saveEmployeeField}
          isSavingField={isSavingField}
        />
      )}
    </div>
  )
}
