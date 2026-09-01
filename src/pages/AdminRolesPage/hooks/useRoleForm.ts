import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import {
  useFunctionalRoleMutations,
} from '@/hooks/data/useFunctionalRolesData'
import { usePermissionCatalogData } from '@/hooks/data/usePermissionsData'
import type { FunctionalRole } from '@/types/functional-roles'

const roleFormSchema = z.object({
  name: z.string().trim().min(1),
  permissionKeys: z.array(z.string()),
})

export type RoleFormValues = z.infer<typeof roleFormSchema>

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

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues,
    values: defaultValues,
  })

  const submit = form.handleSubmit(async values => {
    if (role) {
      await updateRole(role.id, {
        ...(role.isBuiltIn ? {} : { name: values.name }),
        permissionKeys: values.permissionKeys,
      })
    } else {
      await createRole(values)
    }
    onSaved()
  })

  const nameDisabled = Boolean(role?.isBuiltIn)
  const rootError =
    createRoleError || updateRoleError ? t('adminRoles.saveFailed') : undefined
  const catalogError = isCatalogError ? t('adminRoles.catalogFailed') : undefined
  const canSubmit = !isCatalogLoading && !isCatalogError && isCatalogSuccess

  return {
    form,
    catalog: permissionCatalog,
    submit,
    nameDisabled,
    isSubmitting: isSavingRole,
    rootError,
    catalogError,
    catalogLoading: isCatalogLoading,
    canSubmit,
  }
}
