import type { ComponentProps } from 'react'
import {
  Popover as UiPopover,
  PopoverAnchor as UiPopoverAnchor,
  PopoverContent as UiPopoverContent,
  PopoverDescription as UiPopoverDescription,
  PopoverHeader as UiPopoverHeader,
  PopoverTitle as UiPopoverTitle,
  PopoverTrigger as UiPopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  popoverContentClassName,
  popoverDescriptionClassName,
  popoverHeaderClassName,
  popoverTitleClassName,
} from './Popover.styles'

export const Popover = UiPopover
export const PopoverTrigger = UiPopoverTrigger
export const PopoverAnchor = UiPopoverAnchor

export const PopoverContent = ({
  className,
  ...props
}: ComponentProps<typeof UiPopoverContent>) => (
  <UiPopoverContent className={cn(popoverContentClassName, className)} {...props} />
)

export const PopoverHeader = ({
  className,
  ...props
}: ComponentProps<typeof UiPopoverHeader>) => (
  <UiPopoverHeader className={cn(popoverHeaderClassName, className)} {...props} />
)

export const PopoverTitle = ({
  className,
  ...props
}: ComponentProps<typeof UiPopoverTitle>) => (
  <UiPopoverTitle className={cn(popoverTitleClassName, className)} {...props} />
)

export const PopoverDescription = ({
  className,
  ...props
}: ComponentProps<typeof UiPopoverDescription>) => (
  <UiPopoverDescription className={cn(popoverDescriptionClassName, className)} {...props} />
)
