import { useState } from 'react'

/** Mirrors backend `DecideResourcingProposalDto.reason` `@MaxLength(2000)`. */
export const DECISION_REASON_MAX_LENGTH = 2000

interface UseDecisionReasonDialogOptions {
  onConfirm: (reason: string) => Promise<void>
}

/**
 * Required-reason dialog pattern (epic-6-context UX & Interaction Patterns):
 * primary action disabled until text is entered, no silent no-reason paths.
 * The parent remounts this dialog (via a `key` tied to the decision target)
 * on every new open, so local text state never needs an effect-driven reset.
 */
export const useDecisionReasonDialog = ({ onConfirm }: UseDecisionReasonDialogOptions) => {
  const [reason, setReason] = useState('')

  const trimmedLength = reason.trim().length
  const canConfirm =
    trimmedLength > 0 && trimmedLength <= DECISION_REASON_MAX_LENGTH

  const handleConfirm = async () => {
    if (!canConfirm) {
      return
    }
    await onConfirm(reason.trim())
  }

  return { reason, setReason, canConfirm, handleConfirm }
}
