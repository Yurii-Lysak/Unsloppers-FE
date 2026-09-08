import { Plus, Share2, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import type { SavedView } from '@/types/saved-views'
import { cn } from '@/lib/utils'

interface ViewTabsProps {
  savedViews: SavedView[]
  activeViewId: string | null
  onSelectAll: () => void
  onSelectView: (view: SavedView) => void
  onSaveCurrent: () => void
  onShareView: (view: SavedView) => void
  onDeleteView: (view: SavedView) => void
}

export const ViewTabs = ({
  savedViews,
  activeViewId,
  onSelectAll,
  onSelectView,
  onSaveCurrent,
  onShareView,
  onDeleteView,
}: ViewTabsProps) => {
  const { t } = useTranslation()

  return (
    <div
      className="flex flex-wrap items-center gap-2 border-b border-border pb-3"
      data-testid="directory-view-tabs"
    >
      <Button
        type="button"
        size="sm"
        variant={activeViewId === null ? 'default' : 'outline'}
        onClick={onSelectAll}
        data-testid="directory-view-tab-all"
      >
        {t('directory.savedViews.allTab')}
      </Button>

      {savedViews.map(view => (
        <div key={view.id} className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={activeViewId === view.id ? 'default' : 'outline'}
            onClick={() => onSelectView(view)}
            data-testid={`directory-view-tab-${view.id}`}
            className={cn(!view.isOwner && 'border-dashed')}
          >
            {view.name}
            {!view.isOwner && view.ownerName
              ? ` (${t('directory.savedViews.sharedBy', { name: view.ownerName })})`
              : ''}
          </Button>
          {view.canEdit && activeViewId === view.id && (
            <>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={t('directory.savedViews.share')}
                onClick={() => onShareView(view)}
                data-testid={`directory-view-share-${view.id}`}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label={t('directory.savedViews.delete')}
                onClick={() => onDeleteView(view)}
                data-testid={`directory-view-delete-${view.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ))}

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onSaveCurrent}
        data-testid="directory-view-save"
      >
        <Plus className="mr-1 h-4 w-4" />
        {t('directory.savedViews.saveView')}
      </Button>
    </div>
  )
}
