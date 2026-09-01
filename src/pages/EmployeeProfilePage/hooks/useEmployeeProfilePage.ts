import { useParams } from 'react-router-dom'
import {
  useEmployeeProfileData,
} from '@/hooks/data/useEmployeesData'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'

interface UseEmployeeProfilePageOptions {
  showAssignmentOnly?: boolean
}

export const useEmployeeProfilePage = ({
  showAssignmentOnly = false,
}: UseEmployeeProfilePageOptions = {}) => {
  const { employeeId = '' } = useParams()
  const { employeeProfile, isProfileLoading, isProfileError } =
    useEmployeeProfileData(employeeId)
  const { canManageFunctionalRoles } = usePermissionsData()

  const showAccessChip =
    employeeProfile !== undefined && employeeProfile.audience.role !== 'Self'

  const showFunctionalRolesSection =
    Boolean(employeeId) && (showAssignmentOnly || canManageFunctionalRoles)

  return {
    employeeId,
    employeeProfile,
    isProfileLoading,
    isProfileError,
    canManageFunctionalRoles,
    showAccessChip,
    showAssignmentOnly,
    showFunctionalRolesSection,
  }
}
