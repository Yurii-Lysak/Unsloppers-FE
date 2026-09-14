import type { ComponentProps } from 'react'
import {
  Card as UiCard,
  CardHeader as UiCardHeader,
  CardTitle as UiCardTitle,
  CardDescription as UiCardDescription,
  CardAction as UiCardAction,
  CardContent as UiCardContent,
  CardFooter as UiCardFooter,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  cardRootClassName,
  cardHeaderClassName,
  cardTitleClassName,
  cardDescriptionClassName,
  cardActionClassName,
  cardContentClassName,
  cardFooterClassName,
} from './Card.styles'

export const Card = ({
  className,
  ...props
}: ComponentProps<typeof UiCard>) => (
  <UiCard className={cn(cardRootClassName, className)} {...props} />
)

export const CardHeader = ({
  className,
  ...props
}: ComponentProps<typeof UiCardHeader>) => (
  <UiCardHeader className={cn(cardHeaderClassName, className)} {...props} />
)

export const CardTitle = ({
  className,
  ...props
}: ComponentProps<typeof UiCardTitle>) => (
  <UiCardTitle className={cn(cardTitleClassName, className)} {...props} />
)

export const CardDescription = ({
  className,
  ...props
}: ComponentProps<typeof UiCardDescription>) => (
  <UiCardDescription
    className={cn(cardDescriptionClassName, className)}
    {...props}
  />
)

export const CardAction = ({
  className,
  ...props
}: ComponentProps<typeof UiCardAction>) => (
  <UiCardAction className={cn(cardActionClassName, className)} {...props} />
)

export const CardContent = ({
  className,
  ...props
}: ComponentProps<typeof UiCardContent>) => (
  <UiCardContent className={cn(cardContentClassName, className)} {...props} />
)

export const CardFooter = ({
  className,
  ...props
}: ComponentProps<typeof UiCardFooter>) => (
  <UiCardFooter className={cn(cardFooterClassName, className)} {...props} />
)
