import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useTimelineData } from '@/hooks/data/useTimelineData'
import type { TimelineEvent } from '@/types/employee-profile'
import {
  createTimelineEventFormSchema,
  type TimelineEventFormValues,
} from '../schemas/timeline-event-form.schema'

const defaultEffectiveDate = (): string => new Date().toISOString().slice(0, 10)

const emptyDefaults = (): TimelineEventFormValues => ({
  type: 'grade',
  effectiveDate: defaultEffectiveDate(),
  oldValue: '',
  newValue: '',
})

export const useAddTimelineEventForm = (employeeId: string) => {
  const { t } = useTranslation()
  const { createTimelineEvent, isCreatingTimelineEvent } = useTimelineData(employeeId)
  const { schema } = useMemo(() => createTimelineEventFormSchema(t), [t])

  const form = useForm<TimelineEventFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyDefaults(),
  })

  const onSubmit = async (values: TimelineEventFormValues) => {
    try {
      await createTimelineEvent({
        type: values.type,
        effectiveDate: values.effectiveDate,
        oldValue: values.oldValue.trim() || undefined,
        newValue: values.newValue.trim() || undefined,
      })
      form.reset(emptyDefaults())
    } catch {
      form.setError('root', { message: t('employeeProfile.s9.saveFailed') })
    }
  }

  return { form, onSubmit, isCreatingTimelineEvent }
}

export const useTimelineEventItem = (employeeId: string, event: TimelineEvent) => {
  const { t } = useTranslation()
  const { updateTimelineEvent, deleteTimelineEvent, isUpdatingTimelineEvent, isDeletingTimelineEvent } =
    useTimelineData(employeeId)
  const { schema } = useMemo(() => createTimelineEventFormSchema(t), [t])
  const defaultValues = useMemo<TimelineEventFormValues>(
    () => ({
      type: event.type as TimelineEventFormValues['type'],
      effectiveDate: event.effectiveDate.slice(0, 10),
      oldValue: event.oldValue ?? '',
      newValue: event.newValue ?? '',
    }),
    [event.effectiveDate, event.newValue, event.oldValue, event.type],
  )

  const form = useForm<TimelineEventFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    values: defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, event.id, form])

  const isMutating = isUpdatingTimelineEvent || isDeletingTimelineEvent || form.formState.isSubmitting

  const onSubmit = async (values: TimelineEventFormValues) => {
    try {
      await updateTimelineEvent(event.id, {
        type: values.type,
        effectiveDate: values.effectiveDate,
        oldValue: values.oldValue.trim() || null,
        newValue: values.newValue.trim() || null,
      })
    } catch {
      form.setError('root', { message: t('employeeProfile.s9.saveFailed') })
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(t('employeeProfile.s9.confirmDelete'))) {
      return
    }

    try {
      await deleteTimelineEvent(event.id)
    } catch {
      form.setError('root', { message: t('employeeProfile.s9.saveFailed') })
    }
  }

  return { form, onSubmit, isMutating, handleDelete }
}
