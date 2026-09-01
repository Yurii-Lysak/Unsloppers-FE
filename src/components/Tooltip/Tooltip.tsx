import type { ComponentProps, ReactNode } from 'react'
import {
  Tooltip as UiTooltip,
  TooltipContent as UiTooltipContent,
  TooltipProvider as UiTooltipProvider,
  TooltipTrigger as UiTooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { tooltipContentClassName, tooltipProviderDelayDuration } from './Tooltip.styles'

export const TooltipProvider = ({
  delayDuration = tooltipProviderDelayDuration,
  ...props
}: ComponentProps<typeof UiTooltipProvider>) => (
  <UiTooltipProvider delayDuration={delayDuration} {...props} />
)

export const Tooltip = UiTooltip
export const TooltipTrigger = UiTooltipTrigger

export const TooltipContent = ({
  className,
  ...props
}: ComponentProps<typeof UiTooltipContent>) => (
  <UiTooltipContent className={cn(tooltipContentClassName, className)} {...props} />
)

interface SimpleTooltipProps {
  content: ReactNode
  children: ReactNode
  side?: ComponentProps<typeof UiTooltipContent>['side']
  sideOffset?: number
}

export const SimpleTooltip = ({
  content,
  children,
  side,
  sideOffset,
}: SimpleTooltipProps) => (
  <Tooltip>
    <TooltipTrigger asChild>{children}</TooltipTrigger>
    <TooltipContent side={side} sideOffset={sideOffset}>
      {content}
    </TooltipContent>
  </Tooltip>
)
