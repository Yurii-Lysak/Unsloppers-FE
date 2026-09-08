import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMentorshipHubMutations } from '@/hooks/data/useMentorshipData'
import type { ActiveMentorshipPair } from '@/types/mentorship'
import {
  createEndPairFormSchema,
  type EndPairFormValues,
} from '../schemas/end-pair-form.schema'

interface UseEndPairFormOptions {
  pair: ActiveMentorshipPair | null
  onSaved: () => void
}

export const useEndPairForm = ({ pair, onSaved }: UseEndPairFormOptions) => {
  const { t } = useTranslation()
  const { endPair, isEndingPair, resetEndMutationState } =
    useMentorshipHubMutations()

  const defaultValues = useMemo<EndPairFormValues>(
    () => ({
      closureFeedback: '',
    }),
    [],
  )

  const { schema } = useMemo(() => createEndPairFormSchema(t), [t])

  const form = useForm<EndPairFormValues>({
    resolver: zodResolver(schema) as Resolver<EndPairFormValues>,
    defaultValues,
  })

  const onSubmit = async (values: EndPairFormValues) => {
    if (!pair) {
      return
    }

    await endPair({
      pairId: pair.id,
      mentorId: pair.mentorId,
      menteeId: pair.menteeId,
      input: { closureFeedback: values.closureFeedback },
    })
    form.reset(defaultValues)
    onSaved()
  }

  return {
    form,
    onSubmit,
    isSubmitting: isEndingPair,
    resetEndMutationState,
  }
}
