import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Modal } from '@/components/Modal/Modal'
import type { AssignableMentee, WillingMentor } from '@/types/mentorship'
import { AssignMenteeForm } from '../AssignMenteeForm/AssignMenteeForm'
import { useAssignMenteeForm } from '../../hooks/useAssignMenteeForm'

interface AssignMenteeDialogProps {
  open: boolean
  mentor: WillingMentor | null
  mentees: AssignableMentee[]
  onClose: () => void
}

export const AssignMenteeDialog = ({
  open,
  mentor,
  mentees,
  onClose,
}: AssignMenteeDialogProps) => {
  const { t } = useTranslation()
  const { form, onSubmit, isSubmitting, resetMutationState } = useAssignMenteeForm({
    mentorId: mentor?.id ?? '',
    onSaved: onClose,
  })

  useEffect(() => {
    if (open) {
      resetMutationState()
      form.reset({ menteeId: '' })
    }
  }, [open, resetMutationState, form])

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  if (!mentor) {
    return null
  }

  const eligibleMentees = mentees.filter((mentee) => mentee.id !== mentor.id)
  const hasMentees = eligibleMentees.length > 0

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t('mentorshipHub.dialogTitle')}
      description={t('mentorshipHub.dialogDescription', {
        mentorName: mentor.displayName,
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
            form="assign-mentee-form"
            disabled={isSubmitting || !hasMentees}
          >
            {isSubmitting ? t('mentorshipHub.saving') : t('mentorshipHub.save')}
          </Button>
        </>
      }
    >
      <AssignMenteeForm form={form} mentees={eligibleMentees} onSubmit={onSubmit} />
    </Modal>
  )
}
