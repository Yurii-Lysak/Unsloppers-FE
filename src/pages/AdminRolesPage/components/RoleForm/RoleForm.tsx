import { useTranslation } from 'react-i18next'
import type { UseFormReturn } from 'react-hook-form'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Form } from '@/components/Form/Form'
import { Input } from '@/components/Input/Input'
import type { PermissionCatalogEntry } from '@/types/functional-roles'
import type { RoleFormValues } from '../../schemas/role-form.schema'

interface RoleFormProps {
  form: UseFormReturn<RoleFormValues>
  onSubmit: (values: RoleFormValues) => Promise<void>
  catalog: PermissionCatalogEntry[]
  selectedKeys: string[]
  togglePermission: (key: string) => void
  nameDisabled: boolean
  rootError?: string
  catalogError?: string
  catalogLoading: boolean
}

export const RoleForm = ({
  form,
  onSubmit,
  catalog,
  selectedKeys,
  togglePermission,
  nameDisabled,
  rootError,
  catalogError,
  catalogLoading,
}: RoleFormProps) => {
  const { t } = useTranslation()

  return (
    <Form id="role-form" form={form} onSubmit={onSubmit} className="space-y-4">
      <Input
        name="name"
        label={t('adminRoles.roleName')}
        id="role-name"
        disabled={nameDisabled}
      />

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
              <Checkbox
                key={entry.key}
                checked={selectedKeys.includes(entry.key)}
                label={entry.label}
                onCheckedChange={() => togglePermission(entry.key)}
              />
            ))}
        </div>
      </fieldset>

      {rootError && (
        <p role="alert" className="text-sm text-destructive">
          {rootError}
        </p>
      )}
    </Form>
  )
}
