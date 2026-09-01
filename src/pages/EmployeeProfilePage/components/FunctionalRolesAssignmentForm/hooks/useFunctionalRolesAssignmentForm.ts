import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useEmployeeFunctionalRolesData } from '@/hooks/data/useEmployeesData'
import { useFunctionalRolesListData } from '@/hooks/data/useFunctionalRolesData'

const schema = z.object({
  roleIds: z.array(z.string()),
})

type FormValues = z.infer<typeof schema>

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

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { roleIds: [] },
  })

  useEffect(() => {
    if (assignedRoles) {
      form.reset({ roleIds: assignedRoles.map(role => role.id) })
    }
  }, [assignedRoles, form])

  const selectedRoleIds = form.watch('roleIds')

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

  const submit = form.handleSubmit(async values => {
    try {
      await saveEmployeeRoles(values.roleIds)
    } catch {
      form.setError('root', { message: t('employeeProfile.saveFailed') })
    }
  })

  return {
    form,
    roleOptions,
    selectedRoleIds,
    toggleRole,
    submit,
    isLoading: isAssignedRolesLoading || isRolesLoading,
    isError: isAssignedRolesError || isRolesError,
    isSavingRoles,
  }
}
