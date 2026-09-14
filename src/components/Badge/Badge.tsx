import type { ComponentProps } from 'react'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'
import { badgeVariants } from './Badge.styles'
import type { VariantProps } from 'class-variance-authority'

interface BadgeProps
  extends ComponentProps<'span'>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

export const Badge = ({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: BadgeProps) => {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}
