import { useEffect, useRef, useState } from 'react'
import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/Button/Button'
import { ConfirmationModal } from '@/components/ConfirmationModal/ConfirmationModal'
import { useSavedViewsData } from '@/hooks/data/useSavedViewsData'
import { EmployeeTable } from './components/EmployeeTable/EmployeeTable'
import { ColumnPicker } from './components/ColumnPicker/ColumnPicker'
import { SaveViewDialog } from './components/SaveViewDialog/SaveViewDialog'
import { ShareViewDialog } from './components/ShareViewDialog/ShareViewDialog'
import { ViewTabs } from './components/ViewTabs/ViewTabs'
import { useAllEmployeesPage } from './hooks/useAllEmployeesPage'
import type { CreateSavedViewInput, SavedView } from '@/types/saved-views'

export const AllEmployeesPage = () => {
  const { t } = useTranslation()
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [shareView, setShareView] = useState<SavedView | null>(null)
  const [deleteView, setDeleteView] = useState<SavedView | null>(null)

  const {
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

  const {
    savedViews,
    isSavedViewsLoading,
    createSavedView,
    deleteSavedView,
    shareSavedView,
    isCreatingSavedView,
    isSharingSavedView,
  } = useSavedViewsData()

  const handleSaveView = async (input: CreateSavedViewInput) => {
    const created = await createSavedView(input)
    applySavedView(created)
  }

  const handleDeleteView = async () => {
    if (!deleteView) {
      return
    }
    await deleteSavedView(deleteView.id)
    if (activeViewId === deleteView.id) {
      selectAllTab()
    }
    setDeleteView(null)
  }

  // Story 3.4 — the server drops a saved view's stored filters entirely when
  // they reference a field this viewer can't see (e.g. a shared view with a
  // management-only filter). Notify once per view/result rather than on
  // every render.
  const lastNoticeKeyRef = useRef<string | null>(null)
  useEffect(() => {
    if (!employeesList?.filtersHidden) {
      return
    }
    const noticeKey = `${activeViewId ?? 'all'}:${JSON.stringify(query.filters)}`
    if (lastNoticeKeyRef.current === noticeKey) {
      return
    }
    lastNoticeKeyRef.current = noticeKey
    toast.info(t('directory.savedViews.filtersHiddenNotice'))
  }, [employeesList?.filtersHidden, activeViewId, query.filters, t])

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

      {!isSavedViewsLoading && (
        <ViewTabs
          savedViews={savedViews ?? []}
          activeViewId={activeViewId}
          onSelectAll={selectAllTab}
          onSelectView={applySavedView}
          onSaveCurrent={() => setIsSaveDialogOpen(true)}
          onShareView={setShareView}
          onDeleteView={setDeleteView}
        />
      )}

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

      <SaveViewDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        currentConfig={getCurrentViewConfig(visibleColumnIds)}
        onSave={handleSaveView}
        isSaving={isCreatingSavedView}
      />

      <ShareViewDialog
        open={shareView !== null}
        onOpenChange={open => {
          if (!open) {
            setShareView(null)
          }
        }}
        view={shareView}
        onShare={async (viewId, recipientEmployeeIds) => {
          await shareSavedView(viewId, { recipientEmployeeIds })
        }}
        isSharing={isSharingSavedView}
      />

      <ConfirmationModal
        open={deleteView !== null}
        onOpenChange={open => {
          if (!open) {
            setDeleteView(null)
          }
        }}
        title={t('directory.savedViews.deleteDialogTitle')}
        description={t('directory.savedViews.deleteDialogDescription', {
          name: deleteView?.name ?? '',
        })}
        confirmLabel={t('directory.savedViews.delete')}
        cancelLabel={t('directory.savedViews.cancel')}
        confirmVariant="destructive"
        onConfirm={handleDeleteView}
      />
    </div>
  )
}
