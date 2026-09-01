import { useState } from 'react'
import { useFunctionalRolesListData } from '@/hooks/data/useFunctionalRolesData'
import type { FunctionalRole } from '@/types/functional-roles'

export const useAdminRolesPage = () => {
  const { rolesList, isRolesLoading, isRolesError } = useFunctionalRolesListData(true)
  const [dialogRole, setDialogRole] = useState<FunctionalRole | undefined>(undefined)
  const [dialogOpen, setDialogOpen] = useState(false)

  const openCreate = () => {
    setDialogRole(undefined)
    setDialogOpen(true)
  }

  const openEdit = (role: FunctionalRole) => {
    setDialogRole(role)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setDialogRole(undefined)
  }

  return {
    rolesList,
    isRolesLoading,
    isRolesError,
    dialogRole,
    dialogOpen,
    openCreate,
    openEdit,
    closeDialog,
  }
}
