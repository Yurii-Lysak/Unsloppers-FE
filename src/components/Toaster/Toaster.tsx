import { Toaster as UiToaster } from '@/components/ui/sonner'
import type { ToasterProps } from 'sonner'
import { toasterClassName } from './Toaster.styles'

export const Toaster = ({ className, ...props }: ToasterProps) => (
  <UiToaster className={`${toasterClassName}${className ? ` ${className}` : ''}`} {...props} />
)
