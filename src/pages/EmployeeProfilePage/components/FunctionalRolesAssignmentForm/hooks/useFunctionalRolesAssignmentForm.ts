import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEmployeeFunctionalRolesData } from '@/hooks/data/useEmployeesData'
import { useFunctionalRolesListData } from '@/hooks/data/useFunctionalRolesData'
import {
  functionalRolesAssignmentFormSchema,
  type FunctionalRolesAssignmentFormValues,
} from '../schemas/functional-roles-assignment-form.schema'

export const useFunctionalRolesAssignmentForm = (employeeId: string) => {
  const { t } = useTranslation()
  const {
    assignedRoles,
    isAssignedRolesLoading,
    isAssignedRolesError,
    saveEmployeeRoles,
    isSavingRoles,
  } = useEmployeeFunctionalRolesData(employeeId, true)
  const { rolesList, isRolesLoading, isRolesError } =
    useFunctionalRolesListData(true)

  const form = useForm<FunctionalRolesAssignmentFormValues>({
    resolver: zodResolver(functionalRolesAssignmentFormSchema.schema),
    defaultValues: { roleIds: [] },
  })

  const defaultValues = useMemo<FunctionalRolesAssignmentFormValues>(
    () => ({ roleIds: assignedRoles?.map(role => role.id) ?? [] }),
    [assignedRoles],
  )

  useEffect(() => {
    if (assignedRoles) {
      form.reset(defaultValues)
    }
  }, [assignedRoles, defaultValues, form])

  const selectedRoleIds = useWatch({
    control: form.control,
    name: 'roleIds',
  }) ?? []

  const roleOptions = useMemo(() => {
    const byId = new Map((rolesList ?? []).map(role => [role.id, role]))
    for (const assignment of assignedRoles ?? []) {
      if (!byId.has(assignment.id)) {
        byId.set(assignment.id, assignment)
      }
    }
    return [...byId.values()].sort((left, right) => left.name.localeCompare(right.name))
  }, [assignedRoles, rolesList])

  const toggleRole = (roleId: string) => {
    const current = form.getValues('roleIds')
    if (current.includes(roleId)) {
      form.setValue(
        'roleIds',
        current.filter(id => id !== roleId),
        { shouldDirty: true },
      )
      return
    }
    form.setValue('roleIds', [...current, roleId], { shouldDirty: true })
  }

  const onSubmit = async (values: FunctionalRolesAssignmentFormValues) => {
    try {
      await saveEmployeeRoles(values.roleIds)
    } catch {
      form.setError('root', { message: t('employeeProfile.saveFailed') })
    }
  }

  return {
    form,
    onSubmit,
    roleOptions,
    selectedRoleIds,
    toggleRole,
    isLoading: isAssignedRolesLoading || isRolesLoading,
    isError: isAssignedRolesError || isRolesError,
    isSavingRoles,
  }
}
