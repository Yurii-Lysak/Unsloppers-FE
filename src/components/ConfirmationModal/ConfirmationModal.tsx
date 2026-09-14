import { useId, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/AlertDialog/AlertDialog'
import { cn } from '@/lib/utils'
import {
  confirmationModalContentClassName,
  confirmationModalFooterClassName,
} from './ConfirmationModal.styles'

interface ConfirmationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  confirmLabel: ReactNode
  cancelLabel: ReactNode
  onConfirm: () => void
  confirmVariant?: 'default' | 'destructive'
  confirmDisabled?: boolean
  confirmDisabledHint?: ReactNode
  contentClassName?: string
}

export const ConfirmationModal = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  confirmVariant = 'default',
  confirmDisabled = false,
  confirmDisabledHint,
  contentClassName,
}: ConfirmationModalProps) => {
  const { t } = useTranslation()
  const [announcedHint, setAnnouncedHint] = useState(false)
  const hintId = useId()
  const showHint = announcedHint && confirmDisabled

  // Reset the announced hint whenever the dialog reopens (covers
  // escape/outside-close, which the parent observes as open → false).
  const [openedBefore, setOpenedBefore] = useState(open)
  if (openedBefore !== open) {
    setOpenedBefore(open)
    if (open) {
      setAnnouncedHint(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(confirmationModalContentClassName, contentClassName)}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>

        {showHint ? (
          <p id={hintId} className="text-sm text-muted-foreground" role="status">
            {confirmDisabledHint ?? t('common.actionUnavailable')}
          </p>
        ) : null}

        <AlertDialogFooter className={confirmationModalFooterClassName}>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            variant={confirmVariant}
            aria-disabled={confirmDisabled}
            aria-describedby={showHint ? hintId : undefined}
            className={cn(confirmDisabled && 'aria-disabled:cursor-not-allowed aria-disabled:opacity-50')}
            onClick={event => {
              event.preventDefault()
              if (confirmDisabled) {
                setAnnouncedHint(true)
                return
              }
              onConfirm()
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
