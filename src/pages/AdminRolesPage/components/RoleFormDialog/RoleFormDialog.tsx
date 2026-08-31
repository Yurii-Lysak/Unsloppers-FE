import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FunctionalRole } from '@/types/functional-roles'
import { useRoleForm } from '../../hooks/useRoleForm'

interface RoleFormDialogProps {
  role?: FunctionalRole
  open: boolean
  onClose: () => void
}

export const RoleFormDialog = ({ role, open, onClose }: RoleFormDialogProps) => {
  const { t } = useTranslation()
  const { form, catalog, submit, nameDisabled, isSubmitting, rootError, catalogError, catalogLoading, canSubmit } =
    useRoleForm({
      role,
      onSaved: onClose,
      enabled: open,
    })

  if (!open) {
    return null
  }

  const selectedKeys = form.watch('permissionKeys')

  const togglePermission = (key: string) => {
    const current = form.getValues('permissionKeys')
    if (current.includes(key)) {
      form.setValue(
        'permissionKeys',
        current.filter(entry => entry !== key),
        { shouldValidate: true },
      )
      return
    }
    form.setValue('permissionKeys', [...current, key], { shouldValidate: true })
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-form-title"
    >
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg">
        <h2 id="role-form-title" className="text-xl font-semibold text-foreground">
          {role ? t('adminRoles.editRole') : t('adminRoles.createRole')}
        </h2>

        <form className="mt-4 space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <Label htmlFor="role-name">{t('adminRoles.roleName')}</Label>
            <Input id="role-name" disabled={nameDisabled} {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{t('adminRoles.validation.name')}</p>
            )}
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">
              {t('adminRoles.permissions')}
            </legend>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-border p-3">
              {catalogLoading && (
                <p className="text-sm text-muted-foreground">{t('adminRoles.loading')}</p>
              )}
              {catalogError && (
                <p role="alert" className="text-sm text-destructive">
                  {catalogError}
                </p>
              )}
              {!catalogLoading &&
                !catalogError &&
                catalog.map(entry => (
                  <label key={entry.key} className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedKeys.includes(entry.key)}
                      onChange={() => togglePermission(entry.key)}
                    />
                    <span>{entry.label}</span>
                  </label>
                ))}
            </div>
          </fieldset>

          {rootError && (
            <p role="alert" className="text-sm text-destructive">
              {rootError}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('adminRoles.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? t('adminRoles.saving') : t('adminRoles.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
