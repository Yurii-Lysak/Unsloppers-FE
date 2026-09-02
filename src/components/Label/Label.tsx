import type { ComponentProps } from 'react'
import { Label as UiLabel } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { labelRootClassName } from './Label.styles'

export const Label = ({ className, ...props }: ComponentProps<typeof UiLabel>) => (
  <UiLabel className={cn(labelRootClassName, className)} {...props} />
)
