import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog/Dialog'
import {
  modalBodyClassName,
  modalContentClassName,
  modalFooterClassName,
} from './Modal.styles'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  contentClassName?: string
  showCloseButton?: boolean
}

export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  contentClassName,
  showCloseButton = true,
}: ModalProps) => (
  <Dialog open={open} onOpenChange={nextOpen => !nextOpen && onClose()}>
    <DialogContent
      className={cn(modalContentClassName, contentClassName)}
      showCloseButton={showCloseButton}
    >
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      <div className={modalBodyClassName}>{children}</div>

      {footer && <DialogFooter className={modalFooterClassName}>{footer}</DialogFooter>}
    </DialogContent>
  </Dialog>
)
