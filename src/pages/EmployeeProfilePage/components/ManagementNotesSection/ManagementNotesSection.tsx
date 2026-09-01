import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { Button } from '@/components/Button/Button'
import {
  useCreateManagementNote,
  useDeleteManagementNote,
  useUpdateManagementNote,
} from '@/api/hooks/useManagementNotesMutations'
import type {
  ManagementNote,
  ManagementNoteRead,
  ManagementNotesSection as ManagementNotesSectionData,
  ProfileSectionEnvelope,
  SectionAccessLevel,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'

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

type CreateNoteFormValues = z.infer<ReturnType<typeof createNoteFormSchema>>
type EditNoteFormValues = z.infer<ReturnType<typeof editNoteFormSchema>>

const isWritableNote = (
  note: ManagementNoteRead | ManagementNote,
): note is ManagementNote =>
  'visibleForEmployee' in note && 'visibleForPm' in note

interface ManagementNotesSectionCardProps {
  employeeId: string
  section: ProfileSectionEnvelope<ManagementNotesSectionData>
  accessLevel: Exclude<SectionAccessLevel, 'none'>
}

export const ManagementNotesSectionCard = ({
  employeeId,
  section,
  accessLevel,
}: ManagementNotesSectionCardProps) => {
  const { t } = useTranslation()

  if (!isSectionData<ManagementNotesSectionData>(section)) {
    return null
  }

  const { notes, hasHiddenNotes } = section.data
  const canWrite = accessLevel === 'RW'

  return (
    <div className="space-y-4" data-testid="management-notes-section">
      {hasHiddenNotes && (
        <p
          className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
          data-testid="management-notes-gate"
        >
          {t('employeeProfile.s7.gated')}
        </p>
      )}

      {notes.length === 0 && !hasHiddenNotes ? (
        <p className="text-sm text-muted-foreground">
          {t('employeeProfile.s7.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <ManagementNoteItem
              key={note.id}
              employeeId={employeeId}
              note={note}
              canWrite={canWrite}
            />
          ))}
        </ul>
      )}

      {canWrite && <AddManagementNoteForm employeeId={employeeId} />}
    </div>
  )
}

const ManagementNoteItem = ({
  employeeId,
  note,
  canWrite,
}: {
  employeeId: string
  note: ManagementNoteRead | ManagementNote
  canWrite: boolean
}) => {
  const { t } = useTranslation()
  const updateNote = useUpdateManagementNote(employeeId)
  const deleteNote = useDeleteManagementNote(employeeId)
  const form = useForm<EditNoteFormValues>({
    resolver: zodResolver(editNoteFormSchema(t)),
    defaultValues: { content: note.content },
  })

  useEffect(() => {
    form.reset({ content: note.content })
  }, [form, note.content, note.id])

  const isMutating =
    updateNote.isPending || deleteNote.isPending || form.formState.isSubmitting

  const onSaveContent = form.handleSubmit(async (values) => {
    try {
      await updateNote.mutateAsync({
        noteId: note.id,
        payload: { content: values.content },
      })
    } catch {
      form.setError('root', { message: t('employeeProfile.s7.saveFailed') })
    }
  })

  const onToggleVisibility = async (
    field: 'visibleForEmployee' | 'visibleForPm',
    checked: boolean,
  ) => {
    try {
      await updateNote.mutateAsync({
        noteId: note.id,
        payload: { [field]: checked },
      })
    } catch {
      form.setError('root', { message: t('employeeProfile.s7.saveFailed') })
    }
  }

  const onDelete = async () => {
    if (!window.confirm(t('employeeProfile.s7.confirmDelete'))) {
      return
    }

    try {
      form.reset({ content: note.content })
      await deleteNote.mutateAsync(note.id)
    } catch {
      form.setError('root', { message: t('employeeProfile.s7.saveFailed') })
    }
  }

  return (
    <li
      className="rounded-md border border-border p-3 text-sm"
      data-testid={`management-note-${note.id}`}
    >
      <p className="text-xs text-muted-foreground">
        {note.author.displayName}
      </p>

      {canWrite ? (
        <form className="mt-2 space-y-2" onSubmit={onSaveContent}>
          <textarea
            className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...form.register('content')}
          />
          {form.formState.errors.content && (
            <p className="text-xs text-destructive">
              {form.formState.errors.content.message}
            </p>
          )}
          <div className="flex flex-wrap gap-4">
            {isWritableNote(note) && (
              <>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={note.visibleForEmployee}
                    disabled={isMutating}
                    onChange={(event) => {
                      void onToggleVisibility(
                        'visibleForEmployee',
                        event.target.checked,
                      )
                    }}
                    data-testid={`management-note-${note.id}-visible-employee`}
                  />
                  {t('employeeProfile.s7.toggleVisibleToEmployee')}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={note.visibleForPm}
                    disabled={isMutating}
                    onChange={(event) => {
                      void onToggleVisibility(
                        'visibleForPm',
                        event.target.checked,
                      )
                    }}
                    data-testid={`management-note-${note.id}-visible-pm`}
                  />
                  {t('employeeProfile.s7.toggleVisibleToPm')}
                </label>
              </>
            )}
          </div>
          {form.formState.errors.root && (
            <p role="alert" className="text-xs text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isMutating}>
              {t('employeeProfile.save')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isMutating}
              onClick={() => {
                void onDelete()
              }}
            >
              {t('employeeProfile.s7.deleteNote')}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-2 whitespace-pre-wrap">{note.content}</p>
      )}
    </li>
  )
}

const AddManagementNoteForm = ({ employeeId }: { employeeId: string }) => {
  const { t } = useTranslation()
  const createNote = useCreateManagementNote(employeeId)
  const form = useForm<CreateNoteFormValues>({
    resolver: zodResolver(createNoteFormSchema(t)),
    defaultValues: {
      content: '',
      visibleForEmployee: false,
      visibleForPm: false,
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createNote.mutateAsync({
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

  return (
    <form className="space-y-2 border-t border-border pt-4" onSubmit={onSubmit}>
      <h3 className="text-sm font-medium text-foreground">
        {t('employeeProfile.s7.addNote')}
      </h3>
      <textarea
        className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        {...form.register('content')}
        data-testid="management-note-add-content"
      />
      {form.formState.errors.content && (
        <p className="text-xs text-destructive">
          {form.formState.errors.content.message}
        </p>
      )}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...form.register('visibleForEmployee')}
            disabled={createNote.isPending}
            data-testid="management-note-add-visible-employee"
          />
          {t('employeeProfile.s7.toggleVisibleToEmployee')}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...form.register('visibleForPm')}
            disabled={createNote.isPending}
            data-testid="management-note-add-visible-pm"
          />
          {t('employeeProfile.s7.toggleVisibleToPm')}
        </label>
      </div>
      {form.formState.errors.root && (
        <p role="alert" className="text-xs text-destructive">
          {form.formState.errors.root.message}
        </p>
      )}
      <Button type="submit" size="sm" disabled={createNote.isPending}>
        {t('employeeProfile.s7.addNote')}
      </Button>
    </form>
  )
}
