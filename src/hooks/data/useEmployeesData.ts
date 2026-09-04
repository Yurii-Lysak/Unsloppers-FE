import { useEmployeeList } from '@/api/hooks/useEmployeeList'
import {
  useEmployeeFunctionalRoles,
  useSetEmployeeFunctionalRoles,
} from '@/api/hooks/useEmployeeFunctionalRoles'
import { useEmployeeLookup } from '@/api/hooks/useEmployeeLookup'
import { useEmployeeProfile } from '@/api/hooks/useEmployeeProfile'
import { useUpdateEmployeeField } from '@/api/hooks/useUpdateEmployeeField'
import type { EmployeeListQuery, FieldValue } from '@/types/employees'

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

export const useEmployeeLookupData = (enabled: boolean) => {
  const {
    data: employeeOptions,
    isLoading: isEmployeeLookupLoading,
    isError: isEmployeeLookupError,
  } = useEmployeeLookup(enabled)

  return {
    employeeOptions,
    isEmployeeLookupLoading,
    isEmployeeLookupError,
  }
}

export const useUpdateEmployeeFieldData = (query: EmployeeListQuery) => {
  const updateFieldMutation = useUpdateEmployeeField(query)

  const saveEmployeeField = async (
    employeeId: string,
    fieldId: string,
    value: FieldValue,
  ) => {
    await updateFieldMutation.mutateAsync({ employeeId, fieldId, value })
  }

  return {
    saveEmployeeField,
    isSavingField: updateFieldMutation.isPending,
  }
}
