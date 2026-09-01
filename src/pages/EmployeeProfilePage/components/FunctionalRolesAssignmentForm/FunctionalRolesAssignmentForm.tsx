import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { useFunctionalRolesAssignmentForm } from './hooks/useFunctionalRolesAssignmentForm'

interface FunctionalRolesAssignmentFormProps {
  employeeId: string
}

export const FunctionalRolesAssignmentForm = ({
  employeeId,
}: FunctionalRolesAssignmentFormProps) => {
  const { t } = useTranslation()
  const {
    form,
    roleOptions,
    selectedRoleIds,
    toggleRole,
    submit,
    isLoading,
    isError,
    isSavingRoles,
  } = useFunctionalRolesAssignmentForm(employeeId)

  if (isLoading) {
    return <p className="text-muted-foreground">{t('employeeProfile.loadingRoles')}</p>
  }

  if (isError) {
    return <p className="text-destructive">{t('employeeProfile.loadRolesFailed')}</p>
  }

  return (
    <form className="space-y-4" onSubmit={submit} data-testid="functional-roles-form">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">
          {t('employeeProfile.functionalRoles')}
        </legend>
        <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-border p-3">
          {roleOptions.map(role => (
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
        disabled={isSavingRoles || !form.formState.isDirty}
        data-testid="functional-roles-save"
      >
        {isSavingRoles ? t('employeeProfile.saving') : t('employeeProfile.save')}
      </Button>
    </form>
  )
}
