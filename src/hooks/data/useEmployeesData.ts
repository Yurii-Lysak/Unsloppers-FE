import { useEmployeeList } from '@/api/hooks/useEmployeeList'
import { useEmployeeLeaveCells } from '@/api/hooks/useEmployeeLeaveCells'
import { useEmployeeLeaves } from '@/api/hooks/useEmployeeLeaves'
import { useExportEmployeesList } from '@/api/hooks/useExportEmployeesList'
import {
  useEmployeeFunctionalRoles,
  useSetEmployeeFunctionalRoles,
} from '@/api/hooks/useEmployeeFunctionalRoles'
import { useEmployeeLookup } from '@/api/hooks/useEmployeeLookup'
import { useEmployeeProfile } from '@/api/hooks/useEmployeeProfile'
import { useUpdateEmployeeField } from '@/api/hooks/useUpdateEmployeeField'
import type { EmployeeListExportQuery, EmployeeListQuery, FieldValue } from '@/types/employees'

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

/** Fills in a profile's S10 section once it's known to be `pending` (Story 3.6 follow-up). */
export const useEmployeeLeavesData = (employeeId: string, enabled: boolean) => {
  const {
    data: leavesSection,
    isLoading: isLeavesLoading,
    isError: isLeavesError,
  } = useEmployeeLeaves(employeeId, enabled)

  return {
    leavesSection,
    isLeavesLoading,
    isLeavesError,
  }
}

/** Batches the leave-dates column for a page of the All Employees list (Story 3.6 follow-up). */
export const useEmployeeLeaveCellsData = (employeeIds: string[], enabled: boolean) => {
  const {
    data: leaveCells,
    isLoading: isLeaveCellsLoading,
    isError: isLeaveCellsError,
  } = useEmployeeLeaveCells(employeeIds, enabled)

  return {
    leaveCells,
    isLeaveCellsLoading,
    isLeaveCellsError,
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

export const useExportEmployeesListData = () => {
  const exportMutation = useExportEmployeesList()

  const exportEmployeesList = async (query: EmployeeListExportQuery) => {
    await exportMutation.mutateAsync(query)
  }

  return {
    exportEmployeesList,
    isExporting: exportMutation.isPending,
  }
}
