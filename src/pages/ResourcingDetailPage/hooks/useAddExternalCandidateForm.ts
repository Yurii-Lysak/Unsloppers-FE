import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { CreateResourcingProposalInput } from '@/types/resourcing'
import {
  createAddExternalCandidateFormSchema,
  type AddExternalCandidateFormValues,
} from '../schemas/add-external-candidate-form.schema'

interface UseAddExternalCandidateFormOptions {
  onSubmitCandidate: (input: CreateResourcingProposalInput) => Promise<void>
}

const defaultValues: AddExternalCandidateFormValues = {
  peopleForceCandidateUrl: '',
  peopleForceCandidateId: undefined,
}

export const useAddExternalCandidateForm = ({
  onSubmitCandidate,
}: UseAddExternalCandidateFormOptions) => {
  const { t } = useTranslation()
  const { schema } = useMemo(() => createAddExternalCandidateFormSchema(t), [t])

  const form = useForm<AddExternalCandidateFormValues>({
    resolver: zodResolver(schema) as Resolver<AddExternalCandidateFormValues>,
    defaultValues,
  })

  const onSubmit = async (values: AddExternalCandidateFormValues) => {
    await onSubmitCandidate(values)
    form.reset(defaultValues)
  }

  return { form, onSubmit }
}
