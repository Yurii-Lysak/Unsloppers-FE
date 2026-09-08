import { useLayout } from '@/contexts/LayoutContext'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'
import { useRiskDashboardNavAccess } from '@/hooks/data/useRiskDashboardData'

export const useSideMenu = () => {
  const { toggleSidebar, isMobileSidebarOpen, closeMobileSidebar } = useLayout()
  const { canManageFunctionalRoles, canCreateFormCampaigns } = usePermissionsData()
  const { showRiskDashboard } = useRiskDashboardNavAccess()

  return {
    toggleSidebar,
    isMobileSidebarOpen,
    closeMobileSidebar,
    showAdminRoles: canManageFunctionalRoles,
    showCampaigns: canCreateFormCampaigns,
    showRiskDashboard,
  }
}
