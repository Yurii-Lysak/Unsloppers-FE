import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Modal } from '@/components/Modal/Modal'
import type { Campaign } from '@/types/campaigns'
import { CampaignForm } from '../CampaignForm/CampaignForm'
import { useCampaignForm } from '../../hooks/useCampaignForm'

interface CampaignFormDialogProps {
  campaign?: Campaign
  open: boolean
  onClose: () => void
}

export const CampaignFormDialog = ({
  campaign,
  open,
  onClose,
}: CampaignFormDialogProps) => {
  const { t } = useTranslation()
  const { form, onSubmit, isSubmitting, isEditing, resetMutationState } =
    useCampaignForm({
      campaign,
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
      title={isEditing ? t('campaigns.editCampaign') : t('campaigns.newCampaign')}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('campaigns.cancel')}
          </Button>
          <Button type="submit" form="campaign-form" disabled={isSubmitting}>
            {isSubmitting ? t('campaigns.saving') : t('campaigns.save')}
          </Button>
        </>
      }
    >
      <CampaignForm form={form} onSubmit={onSubmit} />
    </Modal>
  )
}
