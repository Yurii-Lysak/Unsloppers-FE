import { Home, Megaphone, Shield, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SideMenuItem } from './components/SideMenuItem/SideMenuItem'
import { SideMenuToggle } from './components/SideMenuToggle/SideMenuToggle'
import { useSideMenu } from './hooks/useSideMenu'
import { cn } from '@/lib/utils'

interface SideMenuProps {
  collapsible?: boolean
  expanded: boolean
}

export const SideMenu = ({ collapsible = true, expanded }: SideMenuProps) => {
  const { t } = useTranslation()
  const {
    toggleSidebar,
    isMobileSidebarOpen,
    closeMobileSidebar,
    showAdminRoles,
    showCampaigns,
  } = useSideMenu()
  const showLabels = expanded || isMobileSidebarOpen

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'flex flex-col border-r border-sidebar-border bg-sidebar overflow-auto',
          'fixed inset-y-0 left-0 z-50 w-64 -translate-x-full transition-transform duration-200 ease-in-out',
          isMobileSidebarOpen && 'translate-x-0',
          'md:relative md:inset-auto md:z-auto md:translate-x-0 md:w-auto md:transition-[width] md:duration-200 md:ease-in-out',
          expanded ? 'md:w-[var(--sidebar-width)]' : 'md:w-[var(--sidebar-collapsed-width)]'
        )}
      >
        <nav className="flex-1 py-2">
          <SideMenuItem
            icon={Home}
            label={t('sidebar.home')}
            path="/"
            hint={t('sidebar.home')}
            expanded={showLabels}
            onNavigate={closeMobileSidebar}
          />
          <SideMenuItem
            icon={Users}
            label={t('sidebar.employees')}
            path="/employees"
            hint={t('sidebar.employees')}
            expanded={showLabels}
            onNavigate={closeMobileSidebar}
            data-testid="sidebar-employees"
          />
          {showCampaigns && (
            <SideMenuItem
              icon={Megaphone}
              label={t('sidebar.campaigns')}
              path="/campaigns"
              hint={t('sidebar.campaigns')}
              expanded={showLabels}
              onNavigate={closeMobileSidebar}
              data-testid="sidebar-campaigns"
            />
          )}
          {showAdminRoles && (
            <div className="py-1">
              {showLabels && (
                <p
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  data-testid="sidebar-admin-section"
                >
                  {t('sidebar.admin')}
                </p>
              )}
              <SideMenuItem
                icon={Shield}
                label={t('sidebar.adminRoles')}
                path="/admin/roles"
                hint={t('sidebar.adminRolesHint')}
                expanded={showLabels}
                onNavigate={closeMobileSidebar}
                data-testid="sidebar-admin-roles"
              />
            </div>
          )}
        </nav>

        {collapsible && (
          <div className="hidden md:block">
            <SideMenuToggle expanded={expanded} onToggle={toggleSidebar} />
          </div>
        )}
      </aside>
    </>
  )
}
