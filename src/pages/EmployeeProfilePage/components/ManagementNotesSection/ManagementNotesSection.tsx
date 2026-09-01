import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import type {
  ManagementNote,
  ManagementNoteRead,
  ManagementNotesSection as ManagementNotesSectionData,
  ProfileSectionEnvelope,
  SectionAccessLevel,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'
import {
  isWritableNote,
  useAddManagementNoteForm,
  useManagementNoteItem,
} from './hooks/useManagementNotesSection'

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
  const { form, isMutating, saveContent, toggleVisibility, handleDelete } =
    useManagementNoteItem(employeeId, note)

  return (
    <li
      className="rounded-md border border-border p-3 text-sm"
      data-testid={`management-note-${note.id}`}
    >
      <p className="text-xs text-muted-foreground">
        {note.author.displayName}
      </p>

      {canWrite ? (
        <form className="mt-2 space-y-2" onSubmit={saveContent}>
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
                      void toggleVisibility(
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
                      void toggleVisibility(
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
                void handleDelete()
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
  const { form, submit, isCreatingNote } = useAddManagementNoteForm(employeeId)

  return (
    <form className="space-y-2 border-t border-border pt-4" onSubmit={submit}>
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
            disabled={isCreatingNote}
            data-testid="management-note-add-visible-employee"
          />
          {t('employeeProfile.s7.toggleVisibleToEmployee')}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            {...form.register('visibleForPm')}
            disabled={isCreatingNote}
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
      <Button type="submit" size="sm" disabled={isCreatingNote}>
        {t('employeeProfile.s7.addNote')}
      </Button>
    </form>
  )
}
