import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog/Dialog'
import { Input } from '@/components/Input/Input'
import type { CreateSavedViewInput } from '@/types/saved-views'

interface SaveViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentConfig: CreateSavedViewInput
  onSave: (input: CreateSavedViewInput) => Promise<void>
  isSaving: boolean
}

export const SaveViewDialog = ({
  open,
  onOpenChange,
  currentConfig,
  onSave,
  isSaving,
}: SaveViewDialogProps) => {
  const { t } = useTranslation()
  const [name, setName] = useState('')

  const handleSave = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      return
    }
    await onSave({ ...currentConfig, name: trimmed })
    setName('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="directory-save-view-dialog">
        <DialogHeader>
          <DialogTitle>{t('directory.savedViews.saveDialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('directory.savedViews.saveDialogDescription')}
          </DialogDescription>
        </DialogHeader>

        <Input
          label={t('directory.savedViews.viewName')}
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder={t('directory.savedViews.viewNamePlaceholder')}
          data-testid="directory-save-view-name"
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            {t('directory.savedViews.cancel')}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || name.trim().length === 0}
            data-testid="directory-save-view-confirm"
          >
            {isSaving
              ? t('directory.savedViews.saving')
              : t('directory.savedViews.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
