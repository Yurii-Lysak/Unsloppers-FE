import {
  useCreateFunctionalRole,
  useFunctionalRolesList,
  useUpdateFunctionalRole,
} from '@/api/hooks/useFunctionalRoles'
import type {
  CreateFunctionalRoleInput,
  UpdateFunctionalRoleInput,
} from '@/types/functional-roles'

export const useFunctionalRolesListData = (enabled: boolean) => {
  const {
    data: rolesList,
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = useFunctionalRolesList(enabled)

  return {
    rolesList,
    isRolesLoading,
    isRolesError,
  }
}

export const useFunctionalRoleMutations = () => {
  const createRoleMutation = useCreateFunctionalRole()
  const updateRoleMutation = useUpdateFunctionalRole()

  const createRole = async (input: CreateFunctionalRoleInput) => {
    await createRoleMutation.mutateAsync(input)
  }

  const updateRole = async (id: string, input: UpdateFunctionalRoleInput) => {
    await updateRoleMutation.mutateAsync({ id, input })
  }

  return {
    createRole,
    updateRole,
    isCreatingRole: createRoleMutation.isPending,
    isUpdatingRole: updateRoleMutation.isPending,
    isSavingRole: createRoleMutation.isPending || updateRoleMutation.isPending,
    createRoleError: createRoleMutation.error,
    updateRoleError: updateRoleMutation.error,
  }
}
