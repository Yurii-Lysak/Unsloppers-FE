import { useState } from 'react'
import { useFunctionalRolesList } from '@/api/hooks/useFunctionalRoles'
import type { FunctionalRole } from '@/types/functional-roles'

export const useAdminRolesPage = () => {
  const rolesQuery = useFunctionalRolesList(true)
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
    rolesQuery,
    dialogRole,
    dialogOpen,
    openCreate,
    openEdit,
    closeDialog,
  }
}
