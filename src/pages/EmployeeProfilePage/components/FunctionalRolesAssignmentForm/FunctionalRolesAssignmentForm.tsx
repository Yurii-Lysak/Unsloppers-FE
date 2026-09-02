import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Form } from '@/components/Form/Form'
import { FormRootError } from '@/components/Form/components/FormRootError/FormRootError'
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
    onSubmit,
    roleOptions,
    selectedRoleIds,
    toggleRole,
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
    <Form
      form={form}
      onSubmit={onSubmit}
      className="space-y-4"
      data-testid="functional-roles-form"
    >
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">
          {t('employeeProfile.functionalRoles')}
        </legend>
        <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-border p-3">
          {roleOptions.map(role => (
            <Checkbox
              key={role.id}
              checked={selectedRoleIds.includes(role.id)}
              label={role.name}
              onCheckedChange={() => toggleRole(role.id)}
              data-testid={`functional-role-option-${role.id}`}
            />
          ))}
        </div>
      </fieldset>

      <FormRootError />

      <Button
        type="submit"
        disabled={isSavingRoles || !form.formState.isDirty}
        data-testid="functional-roles-save"
      >
        {isSavingRoles ? t('employeeProfile.saving') : t('employeeProfile.save')}
      </Button>
    </Form>
  )
}
