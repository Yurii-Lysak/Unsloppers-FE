import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Modal } from '@/components/Modal/Modal'
import { Textarea } from '@/components/Textarea/Textarea'
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t(`resourcing.detail.decide.${mode}.title`)}
      description={t(`resourcing.detail.decide.${mode}.description`)}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            {t('resourcing.cancel')}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => void handleConfirm()}
            disabled={!canConfirm || isSubmitting}
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
    </Modal>
  )
}
