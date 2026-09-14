import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLayout } from '@/contexts/LayoutContext'

export const useMainHeader = () => {
  const { openMobileSidebar } = useLayout()
  const { session, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutFailed, setLogoutFailed] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setLogoutFailed(false)
    try {
      await logout()
    } catch {
      setLogoutFailed(true)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return {
    openMobileSidebar,
    logout: () => void handleLogout(),
    isLoggingOut,
    logoutFailed,
    currentUserName: session?.name ?? null,
    currentUserEmployeeId: session?.employeeId ?? null,
  }
}
