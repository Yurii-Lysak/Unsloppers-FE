import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  useEmployeeLeavesData,
  useEmployeeProfileData,
} from '@/hooks/data/useEmployeesData'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'
import type { EmployeeProfile } from '@/types/employee-profile'

interface UseEmployeeProfilePageOptions {
  showAssignmentOnly?: boolean
}

export const useEmployeeProfilePage = ({
  showAssignmentOnly = false,
}: UseEmployeeProfilePageOptions = {}) => {
  const { employeeId = '' } = useParams()
  const { employeeProfile: rawEmployeeProfile, isProfileLoading, isProfileError } =
    useEmployeeProfileData(employeeId)
  const { canManageFunctionalRoles } = usePermissionsData()

  const s10 = rawEmployeeProfile?.sections.S10
  const isS10Pending = Boolean(s10 && 'status' in s10 && s10.status === 'pending')
  const { leavesSection, isLeavesError } = useEmployeeLeavesData(
    employeeId,
    isS10Pending,
  )

  // The profile read leaves S10 (leaves) as `pending` rather than blocking
  // on TimeTracker — fetch it separately and fold the result back into the
  // profile shape every other section already expects, once it resolves.
  const employeeProfile = useMemo<EmployeeProfile | undefined>(() => {
    if (!rawEmployeeProfile || !isS10Pending || !s10) {
      return rawEmployeeProfile
    }
    if (leavesSection) {
      return {
        ...rawEmployeeProfile,
        sections: {
          ...rawEmployeeProfile.sections,
          S10: { accessLevel: s10.accessLevel, data: leavesSection },
        },
      }
    }
    if (isLeavesError) {
      return {
        ...rawEmployeeProfile,
        sections: {
          ...rawEmployeeProfile.sections,
          S10: { accessLevel: s10.accessLevel, status: 'unavailable' },
        },
      }
    }
    return rawEmployeeProfile
  }, [rawEmployeeProfile, isS10Pending, s10, leavesSection, isLeavesError])

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
