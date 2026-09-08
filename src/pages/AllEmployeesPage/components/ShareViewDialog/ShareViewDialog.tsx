import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog/Dialog'
import { useEmployeeLookupData } from '@/hooks/data/useEmployeesData'
import type { EmployeeLookupOption } from '@/types/employees'
import type { SavedView } from '@/types/saved-views'

interface ShareViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  view: SavedView | null
  onShare: (viewId: string, recipientEmployeeIds: string[]) => Promise<void>
  isSharing: boolean
}

interface ShareViewDialogFormProps {
  view: SavedView
  employeeOptions: EmployeeLookupOption[]
  isLoadingOptions: boolean
  onShare: (viewId: string, recipientEmployeeIds: string[]) => Promise<void>
  isSharing: boolean
  onClose: () => void
}

const ShareViewDialogForm = ({
  view,
  employeeOptions,
  isLoadingOptions,
  onShare,
  isSharing,
  onClose,
}: ShareViewDialogFormProps) => {
  const { t } = useTranslation()
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => view.sharedWith.map(recipient => recipient.employeeId),
  )

  // The full employee roster from `/employees/lookup` is the source of
  // truth, but always keep any already-shared recipient in the rendered
  // list even if they're momentarily missing from that roster response —
  // resubmitting the form must never silently drop them (Review][Patch).
  const knownOptionIds = new Set(employeeOptions.map(option => option.employeeId))
  const missingSharedOptions = view.sharedWith
    .filter(recipient => !knownOptionIds.has(recipient.employeeId))
    .map(recipient => ({ employeeId: recipient.employeeId, name: recipient.name }))

  const recipientOptions = [...employeeOptions, ...missingSharedOptions].sort(
    (left, right) => left.name.localeCompare(right.name),
  )

  const toggleRecipient = (employeeId: string, checked: boolean) => {
    setSelectedIds(prev =>
      checked ? [...prev, employeeId] : prev.filter(id => id !== employeeId),
    )
  }

  const handleShare = async () => {
    // Empty selection is valid — it unshares the view from everyone.
    await onShare(view.id, selectedIds)
    onClose()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t('directory.savedViews.shareDialogTitle')}</DialogTitle>
        <DialogDescription>
          {t('directory.savedViews.shareDialogDescription', {
            name: view.name,
          })}
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-64 space-y-2 overflow-y-auto">
        {isLoadingOptions && (
          <p className="text-sm text-muted-foreground">
            {t('directory.savedViews.loadingRecipients')}
          </p>
        )}
        {!isLoadingOptions && recipientOptions.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t('directory.savedViews.noRecipients')}
          </p>
        )}
        {recipientOptions.map(option => (
          <label
            key={option.employeeId}
            className="flex items-center gap-2 text-sm"
          >
            <Checkbox
              checked={selectedIds.includes(option.employeeId)}
              onCheckedChange={checked =>
                toggleRecipient(option.employeeId, checked === true)
              }
            />
            <span>{option.name}</span>
          </label>
        ))}
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSharing}
        >
          {t('directory.savedViews.cancel')}
        </Button>
        <Button
          type="button"
          onClick={handleShare}
          disabled={isSharing}
          data-testid="directory-share-view-confirm"
        >
          {isSharing
            ? t('directory.savedViews.sharing')
            : t('directory.savedViews.share')}
        </Button>
      </DialogFooter>
    </>
  )
}

export const ShareViewDialog = ({
  open,
  onOpenChange,
  view,
  onShare,
  isSharing,
}: ShareViewDialogProps) => {
  const { employeeOptions, isEmployeeLookupLoading } = useEmployeeLookupData(
    open && view !== null,
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="directory-share-view-dialog">
        {view && (
          <ShareViewDialogForm
            key={view.id}
            view={view}
            employeeOptions={employeeOptions ?? []}
            isLoadingOptions={isEmployeeLookupLoading}
            onShare={onShare}
            isSharing={isSharing}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
