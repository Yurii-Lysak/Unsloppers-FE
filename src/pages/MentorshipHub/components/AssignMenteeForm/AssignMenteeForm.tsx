import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from '@/components/Form/Form'
import { Select } from '@/components/Select/Select'
import type { AssignableMentee } from '@/types/mentorship'
import type { AssignMenteeFormValues } from '../../schemas/assign-mentee-form.schema'

interface AssignMenteeFormProps {
  form: UseFormReturn<AssignMenteeFormValues>
  mentees: AssignableMentee[]
  onSubmit: (values: AssignMenteeFormValues) => Promise<void>
}

export const AssignMenteeForm = ({
  form,
  mentees,
  onSubmit,
}: AssignMenteeFormProps) => {
  const { t } = useTranslation()

  const options = mentees.map(mentee => ({
    value: mentee.id,
    label: mentee.displayName,
  }))

  return (
    <Form form={form} onSubmit={onSubmit} id="assign-mentee-form">
      <Select
        name="menteeId"
        label={t('mentorshipHub.menteeLabel')}
        placeholder={t('mentorshipHub.menteePlaceholder')}
        options={options}
        disabled={options.length === 0}
      />
      {options.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {t('mentorshipHub.noAssignableMentees')}
        </p>
      )}
    </Form>
  )
}
