import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Modal } from '@/components/Modal/Modal'
import type { ActiveMentorshipPair } from '@/types/mentorship'
import { useEndPairForm } from '../../hooks/useEndPairForm'
import { EndPairForm } from './EndPairForm'

interface EndPairDialogProps {
  open: boolean
  pair: ActiveMentorshipPair | null
  onClose: () => void
}

export const EndPairDialog = ({ open, pair, onClose }: EndPairDialogProps) => {
  const { t } = useTranslation()
  const { form, onSubmit, isSubmitting, resetEndMutationState } = useEndPairForm({
    pair,
    onSaved: onClose,
  })

  useEffect(() => {
    if (open) {
      resetEndMutationState()
      form.reset({ closureFeedback: '' })
    }
  }, [open, resetEndMutationState, form])

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  if (!pair) {
    return null
  }

  const feedback = form.watch('closureFeedback')
  const hasFeedback = feedback.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t('mentorshipHub.end.dialogTitle')}
      description={t('mentorshipHub.end.dialogDescription', {
        mentorName: pair.mentorDisplayName,
        menteeName: pair.menteeDisplayName,
      })}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('mentorshipHub.cancel')}
          </Button>
          <Button
            type="submit"
            form="end-pair-form"
            disabled={isSubmitting || !hasFeedback}
          >
            {isSubmitting ? t('mentorshipHub.end.saving') : t('mentorshipHub.end.confirm')}
          </Button>
        </>
      }
    >
      <EndPairForm form={form} onSubmit={onSubmit} />
    </Modal>
  )
}
