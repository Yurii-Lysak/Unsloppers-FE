import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { FormRootError } from '@/components/Form/components/FormRootError/FormRootError'
import { Switch } from '@/components/Switch/Switch'
import { Textarea } from '@/components/Textarea/Textarea'
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
  const { form, onSubmit, isMutating, toggleVisibility, handleDelete } =
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
        <Form form={form} onSubmit={onSubmit} className="mt-2 space-y-2">
          <Textarea name="content" className="min-h-20" />
          <div className="flex flex-wrap gap-4">
            {isWritableNote(note) && (
              <>
                <Switch
                  checked={note.visibleForEmployee}
                  disabled={isMutating}
                  label={t('employeeProfile.s7.toggleVisibleToEmployee')}
                  onCheckedChange={checked => {
                    void toggleVisibility('visibleForEmployee', checked)
                  }}
                  data-testid={`management-note-${note.id}-visible-employee`}
                />
                <Switch
                  checked={note.visibleForPm}
                  disabled={isMutating}
                  label={t('employeeProfile.s7.toggleVisibleToPm')}
                  onCheckedChange={checked => {
                    void toggleVisibility('visibleForPm', checked)
                  }}
                  data-testid={`management-note-${note.id}-visible-pm`}
                />
              </>
            )}
          </div>
          <FormRootError />
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
        </Form>
      ) : (
        <p className="mt-2 whitespace-pre-wrap">{note.content}</p>
      )}
    </li>
  )
}

const AddManagementNoteForm = ({ employeeId }: { employeeId: string }) => {
  const { t } = useTranslation()
  const { form, onSubmit, isCreatingNote } = useAddManagementNoteForm(employeeId)

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="space-y-2 border-t border-border pt-4"
    >
      <h3 className="text-sm font-medium text-foreground">
        {t('employeeProfile.s7.addNote')}
      </h3>
      <Textarea
        name="content"
        className="min-h-20"
        data-testid="management-note-add-content"
      />
      <div className="flex flex-wrap gap-4">
        <Switch
          name="visibleForEmployee"
          disabled={isCreatingNote}
          label={t('employeeProfile.s7.toggleVisibleToEmployee')}
          data-testid="management-note-add-visible-employee"
        />
        <Switch
          name="visibleForPm"
          disabled={isCreatingNote}
          label={t('employeeProfile.s7.toggleVisibleToPm')}
          data-testid="management-note-add-visible-pm"
        />
      </div>
      <FormRootError />
      <Button type="submit" size="sm" disabled={isCreatingNote}>
        {t('employeeProfile.s7.addNote')}
      </Button>
    </Form>
  )
}
