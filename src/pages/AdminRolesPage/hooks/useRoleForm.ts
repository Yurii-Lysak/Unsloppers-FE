import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import {
  useCreateFunctionalRole,
  usePermissionCatalog,
  useUpdateFunctionalRole,
} from '@/api/hooks/useFunctionalRoles'
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
  const catalogQuery = usePermissionCatalog(enabled)
  const createMutation = useCreateFunctionalRole()
  const updateMutation = useUpdateFunctionalRole()

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
      await updateMutation.mutateAsync({
        id: role.id,
        input: {
          ...(role.isBuiltIn ? {} : { name: values.name }),
          permissionKeys: values.permissionKeys,
        },
      })
    } else {
      await createMutation.mutateAsync(values)
    }
    onSaved()
  })

  const nameDisabled = Boolean(role?.isBuiltIn)
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const rootError =
    createMutation.error || updateMutation.error ? t('adminRoles.saveFailed') : undefined
  const catalogError = catalogQuery.isError ? t('adminRoles.catalogFailed') : undefined
  const catalogLoading = catalogQuery.isLoading
  const canSubmit =
    !catalogLoading && !catalogError && !catalogQuery.isError && catalogQuery.isSuccess

  return {
    form,
    catalog: catalogQuery.data ?? [],
    submit,
    nameDisabled,
    isSubmitting,
    rootError,
    catalogError,
    catalogLoading,
    canSubmit,
  }
}
