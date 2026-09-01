import { Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { RoleFormDialog } from './components/RoleFormDialog/RoleFormDialog'
import { useAdminRolesPage } from './hooks/useAdminRolesPage'

export const AdminRolesPage = () => {
  const { t } = useTranslation()
  const {
    rolesList,
    isRolesLoading,
    isRolesError,
    dialogRole,
    dialogOpen,
    openCreate,
    openEdit,
    closeDialog,
  } = useAdminRolesPage()

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

      {isRolesLoading && (
        <p className="text-muted-foreground">{t('adminRoles.loading')}</p>
      )}

      {isRolesError && (
        <p className="text-destructive">{t('adminRoles.loadFailed')}</p>
      )}

      {rolesList && (
        <ul className="divide-y divide-border rounded-lg border border-border" data-testid="admin-roles-list">
          {rolesList.map(role => (
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
