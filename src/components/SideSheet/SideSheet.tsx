import type { ComponentProps, ReactNode } from 'react'
import {
  Sheet as UiSheet,
  SheetClose as UiSheetClose,
  SheetContent as UiSheetContent,
  SheetDescription as UiSheetDescription,
  SheetFooter as UiSheetFooter,
  SheetHeader as UiSheetHeader,
  SheetTitle as UiSheetTitle,
  SheetTrigger as UiSheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import {
  sideSheetBodyClassName,
  sideSheetContentClassName,
  sideSheetFooterClassName,
  sideSheetHeaderClassName,
} from './SideSheet.styles'

export const Sheet = UiSheet
export const SheetTrigger = UiSheetTrigger
export const SheetClose = UiSheetClose

export const SheetContent = ({
  className,
  ...props
}: ComponentProps<typeof UiSheetContent>) => (
  <UiSheetContent className={cn(sideSheetContentClassName, className)} {...props} />
)

export const SheetHeader = ({
  className,
  ...props
}: ComponentProps<typeof UiSheetHeader>) => (
  <UiSheetHeader className={cn(sideSheetHeaderClassName, className)} {...props} />
)

export const SheetFooter = ({
  className,
  ...props
}: ComponentProps<typeof UiSheetFooter>) => (
  <UiSheetFooter className={cn(sideSheetFooterClassName, className)} {...props} />
)

export const SheetTitle = UiSheetTitle
export const SheetDescription = UiSheetDescription

interface SideSheetProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  side?: ComponentProps<typeof UiSheetContent>['side']
  contentClassName?: string
  showCloseButton?: boolean
}

export const SideSheet = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = 'right',
  contentClassName,
  showCloseButton = true,
}: SideSheetProps) => (
  <Sheet open={open} onOpenChange={nextOpen => !nextOpen && onClose()}>
    <SheetContent
      side={side}
      className={contentClassName}
      showCloseButton={showCloseButton}
    >
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        {description && <SheetDescription>{description}</SheetDescription>}
      </SheetHeader>

      <div className={sideSheetBodyClassName}>{children}</div>

      {footer && <SheetFooter>{footer}</SheetFooter>}
    </SheetContent>
  </Sheet>
)
