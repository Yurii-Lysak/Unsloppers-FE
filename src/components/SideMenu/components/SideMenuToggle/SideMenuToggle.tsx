import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { cn } from '@/lib/utils'

interface SideMenuToggleProps {
  expanded: boolean
  onToggle: () => void
}

export const SideMenuToggle = ({ expanded, onToggle }: SideMenuToggleProps) => {
  const { t } = useTranslation()

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onToggle}
      className={cn(
        'h-auto w-full rounded-none border-t border-sidebar-border bg-sidebar py-2 text-sidebar-foreground hover:bg-sidebar-accent',
      )}
      aria-label={expanded ? t('sidebar.collapse') : t('sidebar.expand')}
      data-testid="sidebar-toggle"
    >
      {expanded ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
    </Button>
  )
}
