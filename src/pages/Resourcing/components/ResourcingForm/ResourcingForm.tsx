import { useTranslation } from 'react-i18next'
import type { UseFormReturn } from 'react-hook-form'
import { Form } from '@/components/Form/Form'
import { Input } from '@/components/Input/Input'
import { Textarea } from '@/components/Textarea/Textarea'
import type { ResourcingFormValues } from '../../schemas/resourcing-form.schema'

interface ResourcingFormProps {
  form: UseFormReturn<ResourcingFormValues>
  onSubmit: (values: ResourcingFormValues) => Promise<void>
}

export const ResourcingForm = ({ form, onSubmit }: ResourcingFormProps) => {
  const { t } = useTranslation()

  return (
    <Form id="resourcing-form" form={form} onSubmit={onSubmit} className="space-y-4">
      <Textarea
        name="vacancyDetails"
        label={t('resourcing.form.vacancyDetails')}
        className="min-h-24"
        data-testid="resourcing-form-vacancy-details"
      />
      <Input
        name="expectedCompBand"
        label={t('resourcing.form.expectedCompBand')}
        data-testid="resourcing-form-expected-comp-band"
      />
      <Input
        name="duration"
        label={t('resourcing.form.duration')}
        data-testid="resourcing-form-duration"
      />
      <Input
        name="workload"
        label={t('resourcing.form.workload')}
        data-testid="resourcing-form-workload"
      />
      <Input
        name="headcount"
        type="number"
        label={t('resourcing.form.headcount')}
        data-testid="resourcing-form-headcount"
      />
      <Input
        name="department"
        label={t('resourcing.form.department')}
        data-testid="resourcing-form-department"
      />
      <Input
        name="projectId"
        label={t('resourcing.form.projectId')}
        placeholder={t('resourcing.form.projectIdPlaceholder')}
        data-testid="resourcing-form-project-id"
      />
    </Form>
  )
}
