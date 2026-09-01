import { useLayout } from '@/contexts/LayoutContext'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'

export const useSideMenu = () => {
  const { toggleSidebar, isMobileSidebarOpen, closeMobileSidebar } = useLayout()
  const { canManageFunctionalRoles, canCreateFormCampaigns } = usePermissionsData()

  return {
    toggleSidebar,
    isMobileSidebarOpen,
    closeMobileSidebar,
    showAdminRoles: canManageFunctionalRoles,
    showCampaigns: canCreateFormCampaigns,
  }
}
