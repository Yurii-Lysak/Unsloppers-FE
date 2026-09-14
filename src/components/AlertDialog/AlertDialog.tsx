import type { ComponentProps } from 'react'
import {
  AlertDialog as UiAlertDialog,
  AlertDialogTrigger as UiAlertDialogTrigger,
  AlertDialogPortal as UiAlertDialogPortal,
  AlertDialogOverlay as UiAlertDialogOverlay,
  AlertDialogContent as UiAlertDialogContent,
  AlertDialogHeader as UiAlertDialogHeader,
  AlertDialogFooter as UiAlertDialogFooter,
  AlertDialogTitle as UiAlertDialogTitle,
  AlertDialogDescription as UiAlertDialogDescription,
  AlertDialogAction as UiAlertDialogAction,
  AlertDialogCancel as UiAlertDialogCancel,
  AlertDialogMedia as UiAlertDialogMedia,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import {
  alertDialogContentClassName,
  alertDialogHeaderClassName,
  alertDialogFooterClassName,
  alertDialogTitleClassName,
  alertDialogDescriptionClassName,
  alertDialogActionClassName,
  alertDialogCancelClassName,
} from './AlertDialog.styles'

export const AlertDialog = UiAlertDialog
export const AlertDialogTrigger = UiAlertDialogTrigger
export const AlertDialogPortal = UiAlertDialogPortal
export const AlertDialogOverlay = UiAlertDialogOverlay
export const AlertDialogMedia = UiAlertDialogMedia

export const AlertDialogContent = ({
  className,
  ...props
}: ComponentProps<typeof UiAlertDialogContent>) => (
  <UiAlertDialogContent
    className={cn(alertDialogContentClassName, className)}
    {...props}
  />
)

export const AlertDialogHeader = ({
  className,
  ...props
}: ComponentProps<typeof UiAlertDialogHeader>) => (
  <UiAlertDialogHeader
    className={cn(alertDialogHeaderClassName, className)}
    {...props}
  />
)

export const AlertDialogFooter = ({
  className,
  ...props
}: ComponentProps<typeof UiAlertDialogFooter>) => (
  <UiAlertDialogFooter
    className={cn(alertDialogFooterClassName, className)}
    {...props}
  />
)

export const AlertDialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof UiAlertDialogTitle>) => (
  <UiAlertDialogTitle
    className={cn(alertDialogTitleClassName, className)}
    {...props}
  />
)

export const AlertDialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof UiAlertDialogDescription>) => (
  <UiAlertDialogDescription
    className={cn(alertDialogDescriptionClassName, className)}
    {...props}
  />
)

export const AlertDialogAction = ({
  className,
  ...props
}: ComponentProps<typeof UiAlertDialogAction>) => (
  <UiAlertDialogAction
    className={cn(alertDialogActionClassName, className)}
    {...props}
  />
)

export const AlertDialogCancel = ({
  className,
  ...props
}: ComponentProps<typeof UiAlertDialogCancel>) => (
  <UiAlertDialogCancel
    className={cn(alertDialogCancelClassName, className)}
    {...props}
  />
)
