import type { VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'
import { buttonRootClassName, buttonVariants } from './Button.styles'

interface ButtonProps
  extends ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = ({
  className,
  variant = 'primary',
  size = 'default',
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), buttonRootClassName, className)}
      {...props}
    />
  )
}
