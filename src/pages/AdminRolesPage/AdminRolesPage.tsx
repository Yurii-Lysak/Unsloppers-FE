import { Shield } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useFunctionalRolesAccess } from '@/api/hooks/useFunctionalRoles'
import { Button } from '@/components/ui/button'
import type { FunctionalRole } from '@/types/functional-roles'
import { RoleFormDialog } from './components/RoleFormDialog/RoleFormDialog'

export const AdminRolesPage = () => {
  const { t } = useTranslation()
  const rolesQuery = useFunctionalRolesAccess()
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground" data-testid="admin-roles-title">
            {t('adminRoles.title')}
          </h1>
        </div>
        <Button onClick={openCreate} data-testid="admin-roles-create">
          {t('adminRoles.newRole')}
        </Button>
      </div>

      {rolesQuery.isLoading && (
        <p className="text-muted-foreground">{t('adminRoles.loading')}</p>
      )}

      {rolesQuery.isError && (
        <p className="text-destructive">{t('adminRoles.loadFailed')}</p>
      )}

      {rolesQuery.data && (
        <ul className="divide-y divide-border rounded-lg border border-border" data-testid="admin-roles-list">
          {rolesQuery.data.map(role => (
            <li
              key={role.id}
              className="flex items-center justify-between gap-4 p-4"
              data-testid={`admin-role-row-${role.id}`}
            >
              <div>
                <p className="font-medium text-foreground">{role.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t('adminRoles.permissionCount', { count: role.permissionKeys.length })}
                </p>
              </div>
              <Button variant="outline" onClick={() => openEdit(role)}>
                {t('adminRoles.edit')}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <RoleFormDialog role={dialogRole} open={dialogOpen} onClose={closeDialog} />
    </div>
  )
}
