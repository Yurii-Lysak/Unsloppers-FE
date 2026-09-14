import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Modal } from '@/components/Modal/Modal'
import { Textarea } from '@/components/Textarea/Textarea'
import { cn } from '@/lib/utils'
import {
  DECISION_REASON_MAX_LENGTH,
  useDecisionReasonDialog,
} from './hooks/useDecisionReasonDialog'

interface DecisionReasonDialogProps {
  open: boolean
  mode: 'reject' | 'reverse'
  onClose: () => void
  onConfirm: (reason: string) => Promise<void>
  isSubmitting: boolean
}

export const DecisionReasonDialog = ({
  open,
  mode,
  onClose,
  onConfirm,
  isSubmitting,
}: DecisionReasonDialogProps) => {
  const { t } = useTranslation()
  const { reason, setReason, canConfirm, handleConfirm } = useDecisionReasonDialog({
    onConfirm,
  })
  const [announcedHint, setAnnouncedHint] = useState(false)
  const gated = !canConfirm || isSubmitting

  const handleClose = () => {
    setAnnouncedHint(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t(`resourcing.detail.decide.${mode}.title`)}
      description={t(`resourcing.detail.decide.${mode}.description`)}
      footer={
        <>
          <Button type="button" variant="outline" onClick={handleClose}>
            {t('resourcing.cancel')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            aria-disabled={gated}
            className={cn(gated && 'aria-disabled:cursor-not-allowed aria-disabled:opacity-50')}
            onClick={() => {
              if (gated) {
                setAnnouncedHint(true)
                return
              }
              void handleConfirm()
            }}
            data-testid="resourcing-decision-reason-confirm"
          >
            {isSubmitting
              ? t('resourcing.saving')
              : t(`resourcing.detail.decide.${mode}.confirm`)}
          </Button>
        </>
      }
    >
      <Textarea
        id="resourcing-decision-reason"
        label={t('resourcing.detail.decide.reasonLabel')}
        value={reason}
        onChange={event => setReason(event.target.value)}
        placeholder={t('resourcing.detail.decide.reasonPlaceholder')}
        maxLength={DECISION_REASON_MAX_LENGTH}
        data-testid="resourcing-decision-reason-input"
      />
      {announcedHint && gated ? (
        <p
          className="text-sm text-muted-foreground"
          role="status"
          data-testid="resourcing-decision-reason-hint"
        >
          {!canConfirm
            ? t('resourcing.detail.decide.reasonRequired')
            : t('resourcing.saving')}
        </p>
      ) : null}
    </Modal>
  )
}
