import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  createAddInternalCandidateFormSchema,
  type AddInternalCandidateFormValues,
} from '../schemas/add-internal-candidate-form.schema'

interface UseAddInternalCandidateFormOptions {
  onSubmitCandidate: (candidateEmployeeId: string) => Promise<void>
}

const defaultValues: AddInternalCandidateFormValues = { candidateEmployeeId: '' }

export const useAddInternalCandidateForm = ({
  onSubmitCandidate,
}: UseAddInternalCandidateFormOptions) => {
  const { t } = useTranslation()
  const { schema } = useMemo(() => createAddInternalCandidateFormSchema(t), [t])

  const form = useForm<AddInternalCandidateFormValues>({
    resolver: zodResolver(schema) as Resolver<AddInternalCandidateFormValues>,
    defaultValues,
  })

  const onSubmit = async (values: AddInternalCandidateFormValues) => {
    await onSubmitCandidate(values.candidateEmployeeId)
    form.reset(defaultValues)
  }

  return { form, onSubmit }
}
