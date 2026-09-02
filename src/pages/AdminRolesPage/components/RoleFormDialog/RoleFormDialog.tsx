import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Modal } from '@/components/Modal/Modal'
import type { FunctionalRole } from '@/types/functional-roles'
import { RoleForm } from '../RoleForm/RoleForm'
import { useRoleForm } from '../../hooks/useRoleForm'

interface RoleFormDialogProps {
  role?: FunctionalRole
  open: boolean
  onClose: () => void
}

export const RoleFormDialog = ({ role, open, onClose }: RoleFormDialogProps) => {
  const { t } = useTranslation()
  const {
    form,
    onSubmit,
    catalog,
    selectedKeys,
    togglePermission,
    nameDisabled,
    isSubmitting,
    rootError,
    catalogError,
    catalogLoading,
    canSubmit,
  } = useRoleForm({
    role,
    onSaved: onClose,
    enabled: open,
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={role ? t('adminRoles.editRole') : t('adminRoles.createRole')}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('adminRoles.cancel')}
          </Button>
          <Button type="submit" form="role-form" disabled={isSubmitting || !canSubmit}>
            {isSubmitting ? t('adminRoles.saving') : t('adminRoles.save')}
          </Button>
        </>
      }
    >
      <RoleForm
        form={form}
        onSubmit={onSubmit}
        catalog={catalog}
        selectedKeys={selectedKeys}
        togglePermission={togglePermission}
        nameDisabled={nameDisabled}
        rootError={rootError}
        catalogError={catalogError}
        catalogLoading={catalogLoading}
      />
    </Modal>
  )
}
