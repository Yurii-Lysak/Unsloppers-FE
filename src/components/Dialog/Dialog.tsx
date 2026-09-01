import type { ComponentProps } from 'react'
import {
  Dialog as UiDialog,
  DialogClose as UiDialogClose,
  DialogContent as UiDialogContent,
  DialogDescription as UiDialogDescription,
  DialogFooter as UiDialogFooter,
  DialogHeader as UiDialogHeader,
  DialogOverlay as UiDialogOverlay,
  DialogPortal as UiDialogPortal,
  DialogTitle as UiDialogTitle,
  DialogTrigger as UiDialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  dialogContentClassName,
  dialogDescriptionClassName,
  dialogFooterClassName,
  dialogHeaderClassName,
  dialogTitleClassName,
} from './Dialog.styles'

export const Dialog = UiDialog
export const DialogTrigger = UiDialogTrigger
export const DialogPortal = UiDialogPortal
export const DialogClose = UiDialogClose
export const DialogOverlay = UiDialogOverlay

export const DialogContent = ({
  className,
  ...props
}: ComponentProps<typeof UiDialogContent>) => (
  <UiDialogContent className={cn(dialogContentClassName, className)} {...props} />
)

export const DialogHeader = ({
  className,
  ...props
}: ComponentProps<typeof UiDialogHeader>) => (
  <UiDialogHeader className={cn(dialogHeaderClassName, className)} {...props} />
)

export const DialogFooter = ({
  className,
  ...props
}: ComponentProps<typeof UiDialogFooter>) => (
  <UiDialogFooter className={cn(dialogFooterClassName, className)} {...props} />
)

export const DialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof UiDialogTitle>) => (
  <UiDialogTitle className={cn(dialogTitleClassName, className)} {...props} />
)

export const DialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof UiDialogDescription>) => (
  <UiDialogDescription className={cn(dialogDescriptionClassName, className)} {...props} />
)
