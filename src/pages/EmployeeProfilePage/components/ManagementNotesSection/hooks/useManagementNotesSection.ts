import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useManagementNotesData } from '@/hooks/data/useManagementNotesData'
import type {
  ManagementNote,
  ManagementNoteRead,
} from '@/types/employee-profile'
import {
  createAddManagementNoteFormSchema,
  createEditManagementNoteFormSchema,
  type AddManagementNoteFormValues,
  type EditManagementNoteFormValues,
} from '../schemas/management-note-form.schema'

export const isWritableNote = (
  note: ManagementNoteRead | ManagementNote,
): note is ManagementNote =>
  'visibleForEmployee' in note && 'visibleForPm' in note

export const useManagementNoteItem = (
  employeeId: string,
  note: ManagementNoteRead | ManagementNote,
) => {
  const { t } = useTranslation()
  const { updateNote, deleteNote, isMutatingNote } =
    useManagementNotesData(employeeId)
  const { schema } = useMemo(() => createEditManagementNoteFormSchema(t), [t])
  const defaultValues = useMemo<EditManagementNoteFormValues>(
    () => ({ content: note.content }),
    [note.content],
  )

  const form = useForm<EditManagementNoteFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    values: defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form, note.id])

  const isMutating = isMutatingNote || form.formState.isSubmitting

  const onSubmit = async (values: EditManagementNoteFormValues) => {
    try {
      await updateNote(note.id, { content: values.content })
    } catch {
      form.setError('root', { message: t('employeeProfile.s7.saveFailed') })
    }
  }

  const toggleVisibility = async (
    field: 'visibleForEmployee' | 'visibleForPm',
    checked: boolean,
  ) => {
    try {
      await updateNote(note.id, { [field]: checked })
    } catch {
      form.setError('root', { message: t('employeeProfile.s7.saveFailed') })
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(t('employeeProfile.s7.confirmDelete'))) {
      return
    }

    try {
      form.reset(defaultValues)
      await deleteNote(note.id)
    } catch {
      form.setError('root', { message: t('employeeProfile.s7.saveFailed') })
    }
  }

  return {
    form,
    onSubmit,
    isMutating,
    toggleVisibility,
    handleDelete,
  }
}

export const useAddManagementNoteForm = (employeeId: string) => {
  const { t } = useTranslation()
  const { createNote, isCreatingNote } = useManagementNotesData(employeeId)
  const { schema } = useMemo(() => createAddManagementNoteFormSchema(t), [t])

  const form = useForm<AddManagementNoteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: '',
      visibleForEmployee: false,
      visibleForPm: false,
    },
  })

  const onSubmit = async (values: AddManagementNoteFormValues) => {
    try {
      await createNote({
        content: values.content,
        visibleForEmployee: values.visibleForEmployee,
        visibleForPm: values.visibleForPm,
      })
      form.reset({
        content: '',
        visibleForEmployee: false,
        visibleForPm: false,
      })
    } catch {
      form.setError('root', { message: t('employeeProfile.s7.saveFailed') })
    }
  }

  return {
    form,
    onSubmit,
    isCreatingNote,
  }
}
