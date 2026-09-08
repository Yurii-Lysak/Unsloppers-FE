import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMentorshipHubMutations } from '@/hooks/data/useMentorshipData'
import {
  createAssignMenteeFormSchema,
  type AssignMenteeFormValues,
} from '../schemas/assign-mentee-form.schema'

interface UseAssignMenteeFormOptions {
  mentorId: string
  onSaved: () => void
}

export const useAssignMenteeForm = ({
  mentorId,
  onSaved,
}: UseAssignMenteeFormOptions) => {
  const { t } = useTranslation()
  const { createPair, isAssigningPair, resetMutationState } =
    useMentorshipHubMutations()

  const defaultValues = useMemo<AssignMenteeFormValues>(
    () => ({
      menteeId: '',
    }),
    [],
  )

  const { schema } = useMemo(() => createAssignMenteeFormSchema(t), [t])

  const form = useForm<AssignMenteeFormValues>({
    resolver: zodResolver(schema) as Resolver<AssignMenteeFormValues>,
    defaultValues,
  })

  const onSubmit = async (values: AssignMenteeFormValues) => {
    await createPair({
      mentorId,
      menteeId: values.menteeId,
    })
    form.reset(defaultValues)
    onSaved()
  }

  return {
    form,
    onSubmit,
    isSubmitting: isAssigningPair,
    resetMutationState,
  }
}
