import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useManagementNotesData } from '@/hooks/data/useManagementNotesData'
import type {
  ManagementNote,
  ManagementNoteRead,
} from '@/types/employee-profile'

const editNoteFormSchema = (t: (key: string) => string) =>
  z.object({
    content: z
      .string()
      .trim()
      .min(1, { message: t('employeeProfile.s7.validation.contentRequired') })
      .max(10_000, {
        message: t('employeeProfile.s7.validation.contentTooLong'),
      }),
  })

type EditNoteFormValues = z.infer<ReturnType<typeof editNoteFormSchema>>

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

  const form = useForm<EditNoteFormValues>({
    resolver: zodResolver(editNoteFormSchema(t)),
    defaultValues: { content: note.content },
  })

  useEffect(() => {
    form.reset({ content: note.content })
  }, [form, note.content, note.id])

  const isMutating = isMutatingNote || form.formState.isSubmitting

  const saveContent = form.handleSubmit(async values => {
    try {
      await updateNote(note.id, { content: values.content })
    } catch {
      form.setError('root', { message: t('employeeProfile.s7.saveFailed') })
    }
  })

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
      form.reset({ content: note.content })
      await deleteNote(note.id)
    } catch {
      form.setError('root', { message: t('employeeProfile.s7.saveFailed') })
    }
  }

  return {
    form,
    isMutating,
    saveContent,
    toggleVisibility,
    handleDelete,
  }
}

const createNoteFormSchema = (t: (key: string) => string) =>
  z.object({
    content: z
      .string()
      .trim()
      .min(1, { message: t('employeeProfile.s7.validation.contentRequired') })
      .max(10_000, {
        message: t('employeeProfile.s7.validation.contentTooLong'),
      }),
    visibleForEmployee: z.boolean(),
    visibleForPm: z.boolean(),
  })

type CreateNoteFormValues = z.infer<ReturnType<typeof createNoteFormSchema>>

export const useAddManagementNoteForm = (employeeId: string) => {
  const { t } = useTranslation()
  const { createNote, isCreatingNote } = useManagementNotesData(employeeId)

  const form = useForm<CreateNoteFormValues>({
    resolver: zodResolver(createNoteFormSchema(t)),
    defaultValues: {
      content: '',
      visibleForEmployee: false,
      visibleForPm: false,
    },
  })

  const submit = form.handleSubmit(async values => {
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
  })

  return {
    form,
    submit,
    isCreatingNote,
  }
}
