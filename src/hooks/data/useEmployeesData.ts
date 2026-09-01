import { useEmployeeList } from '@/api/hooks/useEmployeeList'
import {
  useEmployeeFunctionalRoles,
  useSetEmployeeFunctionalRoles,
} from '@/api/hooks/useEmployeeFunctionalRoles'
import { useEmployeeProfile } from '@/api/hooks/useEmployeeProfile'
import type { EmployeeListQuery } from '@/types/employees'

export const useEmployeesListData = (query: EmployeeListQuery) => {
  const {
    data: employeesList,
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
  } = useEmployeeList(query)

  return {
    employeesList,
    isEmployeesLoading,
    isEmployeesError,
  }
}

export const useEmployeeProfileData = (employeeId: string) => {
  const {
    data: employeeProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useEmployeeProfile(employeeId)

  return {
    employeeProfile,
    isProfileLoading,
    isProfileError,
  }
}

export const useEmployeeFunctionalRolesData = (
  employeeId: string,
  enabled: boolean,
) => {
  const {
    data: assignedRoles,
    isLoading: isAssignedRolesLoading,
    isError: isAssignedRolesError,
  } = useEmployeeFunctionalRoles(employeeId, enabled)

  const saveRolesMutation = useSetEmployeeFunctionalRoles(employeeId)

  const saveEmployeeRoles = async (roleIds: string[]) => {
    await saveRolesMutation.mutateAsync(roleIds)
  }

  return {
    assignedRoles,
    isAssignedRolesLoading,
    isAssignedRolesError,
    saveEmployeeRoles,
    isSavingRoles: saveRolesMutation.isPending,
  }
}
