import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useResourcingMutations } from '@/hooks/data/useResourcingData'
import {
  createResourcingFormSchema,
  type ResourcingFormValues,
} from '../schemas/resourcing-form.schema'

interface UseResourcingFormOptions {
  onSaved: () => void
}

export const useResourcingForm = ({ onSaved }: UseResourcingFormOptions) => {
  const { t } = useTranslation()
  const { createRequest, isSavingRequest, resetMutationState } =
    useResourcingMutations()

  const defaultValues = useMemo<ResourcingFormValues>(
    () => ({
      vacancyDetails: '',
      expectedCompBand: '',
      duration: '',
      workload: '',
      headcount: 1,
      department: '',
      projectId: undefined,
    }),
    [],
  )

  const { schema } = useMemo(() => createResourcingFormSchema(t), [t])

  const form = useForm<ResourcingFormValues>({
    resolver: zodResolver(schema) as Resolver<ResourcingFormValues>,
    defaultValues,
  })

  const onSubmit = async (values: ResourcingFormValues) => {
    await createRequest(values)
    form.reset(defaultValues)
    onSaved()
  }

  return {
    form,
    onSubmit,
    isSubmitting: isSavingRequest,
    resetMutationState,
  }
}
