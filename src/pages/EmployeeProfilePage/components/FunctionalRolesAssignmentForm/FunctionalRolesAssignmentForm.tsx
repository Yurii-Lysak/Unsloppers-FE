import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import {
  useEmployeeFunctionalRoles,
  useSetEmployeeFunctionalRoles,
} from '@/api/hooks/useEmployeeFunctionalRoles'
import { useFunctionalRolesList } from '@/api/hooks/useFunctionalRoles'
import { Button } from '@/components/ui/button'

const schema = z.object({
  roleIds: z.array(z.string()),
})

type FormValues = z.infer<typeof schema>

interface FunctionalRolesAssignmentFormProps {
  employeeId: string
}

export const FunctionalRolesAssignmentForm = ({
  employeeId,
}: FunctionalRolesAssignmentFormProps) => {
  const { t } = useTranslation()
  const assignmentsQuery = useEmployeeFunctionalRoles(employeeId, true)
  const rolesQuery = useFunctionalRolesList(true)
  const saveMutation = useSetEmployeeFunctionalRoles(employeeId)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { roleIds: [] },
  })

  useEffect(() => {
    if (assignmentsQuery.data) {
      form.reset({ roleIds: assignmentsQuery.data.map(role => role.id) })
    }
  }, [assignmentsQuery.data, form])

  const selectedRoleIds = form.watch('roleIds')

  const roleOptions = useMemo(() => {
    const byId = new Map((rolesQuery.data ?? []).map(role => [role.id, role]))
    for (const assignment of assignmentsQuery.data ?? []) {
      if (!byId.has(assignment.id)) {
        byId.set(assignment.id, assignment)
      }
    }
    return [...byId.values()].sort((left, right) => left.name.localeCompare(right.name))
  }, [assignmentsQuery.data, rolesQuery.data])

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

  const onSubmit = form.handleSubmit(async values => {
    try {
      await saveMutation.mutateAsync(values.roleIds)
    } catch {
      form.setError('root', { message: t('employeeProfile.saveFailed') })
    }
  })

  if (assignmentsQuery.isLoading || rolesQuery.isLoading) {
    return <p className="text-muted-foreground">{t('employeeProfile.loadingRoles')}</p>
  }

  if (assignmentsQuery.isError || rolesQuery.isError) {
    return <p className="text-destructive">{t('employeeProfile.loadRolesFailed')}</p>
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} data-testid="functional-roles-form">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">
          {t('employeeProfile.functionalRoles')}
        </legend>
        <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-border p-3">
          {(roleOptions).map(role => (
            <label key={role.id} className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedRoleIds.includes(role.id)}
                onChange={() => toggleRole(role.id)}
                data-testid={`functional-role-option-${role.id}`}
              />
              <span>{role.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {form.formState.errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={saveMutation.isPending || !form.formState.isDirty}
        data-testid="functional-roles-save"
      >
        {saveMutation.isPending ? t('employeeProfile.saving') : t('employeeProfile.save')}
      </Button>
    </form>
  )
}
