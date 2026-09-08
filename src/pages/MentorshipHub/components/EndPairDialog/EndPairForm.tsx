import type { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from '@/components/Form/Form'
import { Textarea } from '@/components/Textarea/Textarea'
import type { EndPairFormValues } from '../../schemas/end-pair-form.schema'

interface EndPairFormProps {
  form: UseFormReturn<EndPairFormValues>
  onSubmit: (values: EndPairFormValues) => Promise<void>
}

export const EndPairForm = ({ form, onSubmit }: EndPairFormProps) => {
  const { t } = useTranslation()

  return (
    <Form
      id="end-pair-form"
      form={form}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <Textarea
        name="closureFeedback"
        label={t('mentorshipHub.end.feedbackLabel')}
        placeholder={t('mentorshipHub.end.feedbackPlaceholder')}
        rows={4}
        data-testid="end-pair-feedback"
      />
    </Form>
  )
}
