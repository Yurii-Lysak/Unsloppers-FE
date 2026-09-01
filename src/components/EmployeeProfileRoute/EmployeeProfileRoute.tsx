import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMyPermissions } from '@/api/hooks/useMyPermissions'
import { PERMISSION_KEYS } from '@/types/permissions'
import { EmployeeProfilePage } from '@/pages/EmployeeProfilePage/EmployeeProfilePage'

export const EmployeeProfileRoute = () => {
  const { t } = useTranslation()
  const permissionsQuery = useMyPermissions()

  if (permissionsQuery.isLoading) {
    return (
      <p className="text-muted-foreground" role="status">
        {t('employeeProfile.loading')}
      </p>
    )
  }

  return <EmployeeProfilePage />
}

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

  const canManageRoles = permissionsQuery.data?.permissions.includes(
    PERMISSION_KEYS.MANAGE_FUNCTIONAL_ROLES,
  )

  if (!canManageRoles) {
    return <Navigate to="/" replace />
  }

  return <EmployeeProfilePage showAssignmentOnly />
}
