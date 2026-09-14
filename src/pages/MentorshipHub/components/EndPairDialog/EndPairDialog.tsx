import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Modal } from '@/components/Modal/Modal'
import { cn } from '@/lib/utils'
import { isReasonConfirmable } from '@/lib/reason-gate'
import type { ActiveMentorshipPair } from '@/types/mentorship'
import { useEndPairForm } from '../../hooks/useEndPairForm'
import { EndPairForm } from './EndPairForm'

/** Mirrors the closure-feedback requirement: ending a pair needs a note. */
export const END_PAIR_FEEDBACK_MAX_LENGTH = 10000

interface EndPairDialogProps {
  open: boolean
  pair: ActiveMentorshipPair | null
  onClose: () => void
}

export const EndPairDialog = ({ open, pair, onClose }: EndPairDialogProps) => {
  const { t } = useTranslation()
  const [announcedHint, setAnnouncedHint] = useState(false)
  const { form, onSubmit, isSubmitting, resetEndMutationState } = useEndPairForm({
    pair,
    onSaved: () => {
      setAnnouncedHint(false)
      onClose()
    },
  })

  useEffect(() => {
    if (open) {
      resetEndMutationState()
      form.reset({ closureFeedback: '' })
    }
  }, [open, resetEndMutationState, form])

  const handleClose = () => {
    if (!isSubmitting) {
      setAnnouncedHint(false)
      onClose()
    }
  }

  if (!pair) {
    return null
  }

  const feedback = form.watch('closureFeedback')
  const canConfirm = isReasonConfirmable(feedback, END_PAIR_FEEDBACK_MAX_LENGTH)
  const gated = isSubmitting || !canConfirm

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
            aria-disabled={gated}
            className={cn(gated && 'aria-disabled:cursor-not-allowed aria-disabled:opacity-50')}
            onClick={event => {
              if (gated) {
                event.preventDefault()
                setAnnouncedHint(true)
              }
            }}
            data-testid="mentorship-end-pair-confirm"
          >
            {isSubmitting ? t('mentorshipHub.end.saving') : t('mentorshipHub.end.confirm')}
          </Button>
        </>
      }
    >
      <EndPairForm form={form} onSubmit={onSubmit} />
      {announcedHint && gated ? (
        <p
          className="text-sm text-muted-foreground"
          role="status"
          data-testid="mentorship-end-pair-hint"
        >
          {!canConfirm
            ? t('mentorshipHub.end.validation.feedbackRequired')
            : t('mentorshipHub.end.saving')}
        </p>
      ) : null}
    </Modal>
  )
}
