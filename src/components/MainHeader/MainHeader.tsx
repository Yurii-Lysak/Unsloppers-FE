import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Logo } from './components/Logo/Logo'
import { useMainHeader } from './hooks/useMainHeader'

interface MainHeaderProps {
  showMenuButton?: boolean
}

export const MainHeader = ({ showMenuButton = false }: MainHeaderProps) => {
  const { t } = useTranslation()
  const { openMobileSidebar, logout, isLoggingOut, logoutFailed } = useMainHeader()

  return (
    <header
      className="flex items-center justify-between border-b border-sidebar-border bg-sidebar"
      style={{ height: 'var(--header-height)' }}
    >
      <div className="flex items-center">
        {showMenuButton && (
          <Button
            type="button"
            variant="ghost"
            onClick={openMobileSidebar}
            className="h-full rounded-none px-3 text-sidebar-foreground hover:bg-sidebar-accent md:hidden"
            aria-label={t('sidebar.openMenu')}
            data-testid="mobile-menu-button"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Logo />
      </div>
      <div className="mr-3 flex items-center gap-3">
        {logoutFailed && (
          <p className="text-sm text-destructive" role="alert">
            {t('auth.logoutFailed')}
          </p>
        )}
        <Button variant="ghost" onClick={logout} disabled={isLoggingOut}>
          {isLoggingOut ? t('auth.loggingOut') : t('auth.logout')}
        </Button>
      </div>
    </header>
  )
}
