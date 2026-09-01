import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { Button as UiButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { buttonRootClassName, buttonVariants } from './Button.styles'

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export const Button = ({ className, ...props }: ButtonProps) => (
  <UiButton className={cn(buttonRootClassName, className)} {...props} />
)
