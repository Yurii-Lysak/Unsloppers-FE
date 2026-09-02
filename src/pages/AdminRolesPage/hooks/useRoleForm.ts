import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  useFunctionalRoleMutations,
} from '@/hooks/data/useFunctionalRolesData'
import { usePermissionCatalogData } from '@/hooks/data/usePermissionsData'
import type { FunctionalRole } from '@/types/functional-roles'
import {
  createRoleFormSchema,
  type RoleFormValues,
} from '../schemas/role-form.schema'

interface UseRoleFormOptions {
  role?: FunctionalRole
  onSaved: () => void
  enabled?: boolean
}

export const useRoleForm = ({ role, onSaved, enabled = true }: UseRoleFormOptions) => {
  const { t } = useTranslation()
  const {
    permissionCatalog,
    isCatalogLoading,
    isCatalogError,
    isCatalogSuccess,
  } = usePermissionCatalogData(enabled)
  const {
    createRole,
    updateRole,
    isSavingRole,
    createRoleError,
    updateRoleError,
  } = useFunctionalRoleMutations()

  const defaultValues = useMemo<RoleFormValues>(
    () => ({
      name: role?.name ?? '',
      permissionKeys: role?.permissionKeys ?? [],
    }),
    [role],
  )

  const { schema } = useMemo(() => createRoleFormSchema(t), [t])

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    values: defaultValues,
  })

  const onSubmit = async (values: RoleFormValues) => {
    if (role) {
      await updateRole(role.id, {
        ...(role.isBuiltIn ? {} : { name: values.name }),
        permissionKeys: values.permissionKeys,
      })
    } else {
      await createRole(values)
    }
    onSaved()
  }

  const nameDisabled = Boolean(role?.isBuiltIn)
  const rootError =
    createRoleError || updateRoleError ? t('adminRoles.saveFailed') : undefined
  const catalogError = isCatalogError ? t('adminRoles.catalogFailed') : undefined
  const canSubmit = !isCatalogLoading && !isCatalogError && isCatalogSuccess

  const selectedKeys = useWatch({
    control: form.control,
    name: 'permissionKeys',
  }) ?? []

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

  return {
    form,
    onSubmit,
    catalog: permissionCatalog,
    selectedKeys,
    togglePermission,
    nameDisabled,
    isSubmitting: isSavingRole,
    rootError,
    catalogError,
    catalogLoading: isCatalogLoading,
    canSubmit,
  }
}
