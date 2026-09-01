import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { useMyPermissions } from '@/api/hooks/useMyPermissions'
import { PERMISSION_KEYS } from '@/types/permissions'
import { EmployeeProfilePage } from '@/pages/EmployeeProfilePage/EmployeeProfilePage'

export const EmployeeProfileRoute = () => <EmployeeProfilePage />

export const EmployeeFunctionalRolesRoute = () => {
  const { t } = useTranslation()
  const permissionsQuery = useMyPermissions()

  if (permissionsQuery.isLoading) {
    return (
      <p className="text-muted-foreground" role="status">
        {t('employeeProfile.loading')}
      </p>
    )
  }

  if (permissionsQuery.isError) {
    return (
      <div className="space-y-3" role="alert">
        <p className="text-destructive">{t('permissions.loadFailed')}</p>
        <Button type="button" variant="outline" onClick={() => permissionsQuery.refetch()}>
          {t('permissions.retry')}
        </Button>
      </div>
    )
  }

  const canManageRoles = permissionsQuery.data?.permissions.includes(
    PERMISSION_KEYS.MANAGE_FUNCTIONAL_ROLES,
  )

  if (!canManageRoles) {
    return <Navigate to="/" replace />
  }

  return <EmployeeProfilePage showAssignmentOnly />
}
