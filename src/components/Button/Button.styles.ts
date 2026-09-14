import { cva } from 'class-variance-authority'

/**
 * Button variants using People Platform Design System theme
 *
 * Variants:
 * - primary: Indigo primary accent (#5B4FE0, default CTA)
 * - secondary: Muted accent background button (--accent-secondary, #F0F0F7 light)
 * - outlined: Bordered button with transparent background
 * - ghost: Transparent with hover state
 * - destructive: Error/danger actions
 * - link: Text link style
 *
 * Sizes:
 * - sm: Small (h-8)
 * - default: Standard (h-9)
 * - lg: Large (h-10)
 * - icon-sm, icon, icon-lg: Icon-only buttons (square)
 */
export const buttonVariants = cva(
  // Base styles
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius)] text-sm font-medium transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary (Indigo #5B4FE0) - default CTA
        primary:
          'bg-primary text-primary-foreground shadow-sm hover:bg-[var(--accent-primary-hover)] active:bg-[var(--accent-primary-active)]',
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-[var(--accent-primary-hover)] active:bg-[var(--accent-primary-active)]',
        
        // Secondary (muted accent, #F0F0F7 light / #A6ADD9 dark)
        secondary:
          'bg-[var(--accent-secondary)] text-foreground shadow-sm hover:bg-[var(--accent-secondary-hover)] active:bg-[var(--accent-secondary-active)]',
        
        // Outlined/bordered
        outlined:
          'border border-border bg-background text-foreground shadow-sm hover:bg-background-hover hover:border-[var(--border-strong)] active:bg-background-active',
        outline:
          'border border-border bg-background text-foreground shadow-sm hover:bg-background-hover hover:border-[var(--border-strong)] active:bg-background-active',
        
        // Ghost (transparent)
        ghost:
          'text-foreground hover:bg-background-hover active:bg-background-active',
        
        // Destructive (error/danger)
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-[var(--accent-error-hover)] active:bg-[var(--accent-error-active)]',
        
        // Link style
        link: 'text-[var(--text-link)] underline-offset-4 hover:underline focus-visible:ring-offset-0',
      },
      size: {
        sm: 'h-8 px-3 text-xs [&_svg]:size-4',
        default: 'h-9 px-4 [&_svg]:size-4',
        lg: 'h-10 px-5 text-base [&_svg]:size-5',
        'icon-xs': 'size-6 [&_svg]:size-3.5',
        'icon-sm': 'size-8 [&_svg]:size-4',
        icon: 'size-9 [&_svg]:size-4',
        'icon-lg': 'size-10 [&_svg]:size-5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export const buttonRootClassName = ''
