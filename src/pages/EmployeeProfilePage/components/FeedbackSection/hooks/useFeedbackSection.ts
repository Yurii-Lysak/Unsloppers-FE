import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useFeedbackData } from '@/hooks/data/useFeedbackData'
import type {
  FeedbackRecord,
  FeedbackRecordRead,
} from '@/types/employee-profile'
import {
  createAddFeedbackFormSchema,
  createEditFeedbackFormSchema,
  todayCalendarDate,
  type AddFeedbackFormValues,
  type EditFeedbackFormValues,
} from '../schemas/feedback-form.schema'

const defaultRecordedAt = (): string => todayCalendarDate()

export const isWritableFeedback = (
  record: FeedbackRecordRead | FeedbackRecord,
): record is FeedbackRecord => 'sharedWithEmployee' in record

export const useFeedbackItem = (
  employeeId: string,
  record: FeedbackRecordRead | FeedbackRecord,
) => {
  const { t } = useTranslation()
  const { updateFeedback, deleteFeedback, isMutatingFeedback } =
    useFeedbackData(employeeId)
  const { schema } = useMemo(() => createEditFeedbackFormSchema(t), [t])
  const defaultValues = useMemo<EditFeedbackFormValues>(
    () => ({
      context: record.context,
      body: record.body,
    }),
    [record.context, record.body],
  )

  const form = useForm<EditFeedbackFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    values: defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form, record.id])

  const isMutating = isMutatingFeedback || form.formState.isSubmitting

  const onSubmit = async (values: EditFeedbackFormValues) => {
    try {
      await updateFeedback(record.id, {
        context: values.context,
        body: values.body,
      })
    } catch {
      form.setError('root', { message: t('employeeProfile.s8.saveFailed') })
    }
  }

  const toggleSharedWithEmployee = async (checked: boolean) => {
    try {
      await updateFeedback(record.id, { sharedWithEmployee: checked })
    } catch {
      form.setError('root', { message: t('employeeProfile.s8.saveFailed') })
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(t('employeeProfile.s8.confirmDelete'))) {
      return
    }

    try {
      form.reset(defaultValues)
      await deleteFeedback(record.id)
    } catch {
      form.setError('root', { message: t('employeeProfile.s8.saveFailed') })
    }
  }

  return {
    form,
    onSubmit,
    isMutating,
    toggleSharedWithEmployee,
    handleDelete,
  }
}

export const useAddFeedbackForm = (employeeId: string) => {
  const { t } = useTranslation()
  const { createFeedback, isCreatingFeedback } = useFeedbackData(employeeId)
  const { schema } = useMemo(() => createAddFeedbackFormSchema(t), [t])

  const form = useForm<AddFeedbackFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      recordedAt: defaultRecordedAt(),
      context: '',
      body: '',
      sharedWithEmployee: false,
    },
  })

  const onSubmit = async (values: AddFeedbackFormValues) => {
    try {
      await createFeedback({
        recordedAt: values.recordedAt,
        context: values.context,
        body: values.body,
        sharedWithEmployee: values.sharedWithEmployee,
      })
      form.reset({
        recordedAt: defaultRecordedAt(),
        context: '',
        body: '',
        sharedWithEmployee: false,
      })
    } catch {
      form.setError('root', { message: t('employeeProfile.s8.saveFailed') })
    }
  }

  return {
    form,
    onSubmit,
    isCreatingFeedback,
  }
}
