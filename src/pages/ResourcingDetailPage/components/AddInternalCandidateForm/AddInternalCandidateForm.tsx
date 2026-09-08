import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { Select } from '@/components/Select/Select'
import type { ResourcingCandidatePoolEntry } from '@/types/resourcing'
import { useAddInternalCandidateForm } from '../../hooks/useAddInternalCandidateForm'

interface AddInternalCandidateFormProps {
  candidatePool: ResourcingCandidatePoolEntry[]
  onSubmitCandidate: (candidateEmployeeId: string) => Promise<void>
  isSubmitting: boolean
}

export const AddInternalCandidateForm = ({
  candidatePool,
  onSubmitCandidate,
  isSubmitting,
}: AddInternalCandidateFormProps) => {
  const { t } = useTranslation()
  const { form, onSubmit } = useAddInternalCandidateForm({ onSubmitCandidate })

  const options = candidatePool.map(entry => ({
    value: entry.id,
    label: entry.displayName,
  }))

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="flex flex-wrap items-end gap-3"
      data-testid="resourcing-add-internal-form"
    >
      <div className="min-w-56">
        <Select
          name="candidateEmployeeId"
          label={t('resourcing.detail.addInternal.candidate')}
          placeholder={t('resourcing.detail.addInternal.selectPlaceholder')}
          options={options}
          disabled={options.length === 0}
        />
      </div>
      <Button
        type="submit"
        variant="outline"
        disabled={isSubmitting || options.length === 0}
        data-testid="resourcing-add-internal-submit"
      >
        {isSubmitting ? t('resourcing.saving') : t('resourcing.detail.addInternal.submit')}
      </Button>
      {options.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {t('resourcing.detail.addInternal.noCandidates')}
        </p>
      )}
    </Form>
  )
}
