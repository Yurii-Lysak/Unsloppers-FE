import { useTranslation } from 'react-i18next'
import type { UseFormReturn } from 'react-hook-form'
import { Form } from '@/components/Form/Form'
import { Input } from '@/components/Input/Input'
import { Textarea } from '@/components/Textarea/Textarea'
import type { CampaignFormValues } from '../../schemas/campaign-form.schema'

interface CampaignFormProps {
  form: UseFormReturn<CampaignFormValues>
  onSubmit: (values: CampaignFormValues) => Promise<void>
}

export const CampaignForm = ({ form, onSubmit }: CampaignFormProps) => {
  const { t } = useTranslation()

  return (
    <Form id="campaign-form" form={form} onSubmit={onSubmit} className="space-y-4">
      <Input
        name="title"
        label={t('campaigns.form.title')}
        data-testid="campaign-form-title"
      />
      <Textarea
        name="description"
        label={t('campaigns.form.description')}
        className="min-h-16"
        data-testid="campaign-form-description"
      />
      <Textarea
        name="purpose"
        label={t('campaigns.form.purpose')}
        className="min-h-24"
        data-testid="campaign-form-purpose"
      />
      <Input
        name="link"
        label={t('campaigns.form.link')}
        placeholder={t('campaigns.form.linkPlaceholder')}
        data-testid="campaign-form-link"
      />
      <Input
        name="dueDate"
        type="date"
        label={t('campaigns.form.dueDate')}
        data-testid="campaign-form-due-date"
      />
    </Form>
  )
}
