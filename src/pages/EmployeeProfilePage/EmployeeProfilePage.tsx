import { UserCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useCanManageFunctionalRoles } from '@/api/hooks/useMyPermissions'
import { useEmployeeDetail } from '@/api/hooks/useEmployees'
import { FunctionalRolesAssignmentForm } from './components/FunctionalRolesAssignmentForm/FunctionalRolesAssignmentForm'

interface EmployeeProfilePageProps {
  showAssignmentOnly?: boolean
}

export const EmployeeProfilePage = ({
  showAssignmentOnly = false,
}: EmployeeProfilePageProps) => {
  const { t } = useTranslation()
  const { employeeId = '' } = useParams()
  const employeeQuery = useEmployeeDetail(employeeId)
  const canManageRoles = useCanManageFunctionalRoles()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <UserCircle className="h-6 w-6 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">
            <Link to="/employees">{t('employeeProfile.backToList')}</Link>
          </p>
          <h1 className="text-3xl font-bold text-foreground" data-testid="employee-profile-title">
            {employeeQuery.data?.displayName ?? t('employeeProfile.loading')}
          </h1>
        </div>
      </div>

      {employeeQuery.isError && (
        <p className="text-destructive">{t('employeeProfile.loadFailed')}</p>
      )}

      {(showAssignmentOnly || canManageRoles) && employeeId && (
        <section
          className="rounded-lg border border-border p-4"
          data-testid="employment-section"
        >
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {t('employeeProfile.employmentSection')}
          </h2>
          <FunctionalRolesAssignmentForm employeeId={employeeId} />
        </section>
      )}
    </div>
  )
}
