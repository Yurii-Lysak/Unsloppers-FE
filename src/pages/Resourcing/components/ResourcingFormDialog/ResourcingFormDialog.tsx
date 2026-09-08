import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Modal } from '@/components/Modal/Modal'
import { ResourcingForm } from '../ResourcingForm/ResourcingForm'
import { useResourcingForm } from '../../hooks/useResourcingForm'

interface ResourcingFormDialogProps {
  open: boolean
  onClose: () => void
}

export const ResourcingFormDialog = ({ open, onClose }: ResourcingFormDialogProps) => {
  const { t } = useTranslation()
  const { form, onSubmit, isSubmitting, resetMutationState } = useResourcingForm({
    onSaved: onClose,
  })

  useEffect(() => {
    if (open) {
      resetMutationState()
    }
  }, [open, resetMutationState])

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t('resourcing.newRequest')}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('resourcing.cancel')}
          </Button>
          <Button type="submit" form="resourcing-form" disabled={isSubmitting}>
            {isSubmitting ? t('resourcing.saving') : t('resourcing.save')}
          </Button>
        </>
      }
    >
      <ResourcingForm form={form} onSubmit={onSubmit} />
    </Modal>
  )
}
