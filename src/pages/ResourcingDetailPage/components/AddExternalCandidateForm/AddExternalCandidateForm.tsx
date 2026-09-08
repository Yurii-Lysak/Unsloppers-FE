import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { Input } from '@/components/Input/Input'
import type { CreateResourcingProposalInput } from '@/types/resourcing'
import { useAddExternalCandidateForm } from '../../hooks/useAddExternalCandidateForm'

interface AddExternalCandidateFormProps {
  onSubmitCandidate: (input: CreateResourcingProposalInput) => Promise<void>
  isSubmitting: boolean
}

export const AddExternalCandidateForm = ({
  onSubmitCandidate,
  isSubmitting,
}: AddExternalCandidateFormProps) => {
  const { t } = useTranslation()
  const { form, onSubmit } = useAddExternalCandidateForm({ onSubmitCandidate })

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="flex flex-wrap items-end gap-3"
      data-testid="resourcing-add-external-form"
    >
      <div className="min-w-64 flex-1">
        <Input
          name="peopleForceCandidateUrl"
          label={t('resourcing.detail.addExternal.url')}
          placeholder={t('resourcing.detail.addExternal.urlPlaceholder')}
          data-testid="resourcing-add-external-url"
        />
      </div>
      <div className="min-w-40">
        <Input
          name="peopleForceCandidateId"
          label={t('resourcing.detail.addExternal.id')}
          data-testid="resourcing-add-external-id"
        />
      </div>
      <Button
        type="submit"
        variant="outline"
        disabled={isSubmitting}
        data-testid="resourcing-add-external-submit"
      >
        {isSubmitting ? t('resourcing.saving') : t('resourcing.detail.addExternal.submit')}
      </Button>
    </Form>
  )
}
