import type { ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
  contentClassName,
}: ConfirmationModalProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent
      className={cn(confirmationModalContentClassName, contentClassName)}
    >
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
      </AlertDialogHeader>

      <AlertDialogFooter className={confirmationModalFooterClassName}>
        <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
        <AlertDialogAction variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
