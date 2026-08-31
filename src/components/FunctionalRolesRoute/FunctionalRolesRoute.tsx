import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFunctionalRolesAccess } from '@/api/hooks/useFunctionalRoles'
import { AdminRolesPage } from '@/pages/AdminRolesPage/AdminRolesPage'

export const FunctionalRolesRoute = () => {
  const { t } = useTranslation()
  const rolesAccessQuery = useFunctionalRolesAccess()

  if (rolesAccessQuery.isLoading) {
    return (
      <p className="text-muted-foreground" role="status">
        {t('adminRoles.loading')}
      </p>
    )
  }

  if (!rolesAccessQuery.isSuccess) {
    return <Navigate to="/" replace />
  }

  return <AdminRolesPage />
}
