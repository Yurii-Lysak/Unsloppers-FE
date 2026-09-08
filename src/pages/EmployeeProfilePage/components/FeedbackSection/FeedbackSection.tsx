import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { FormRootError } from '@/components/Form/components/FormRootError/FormRootError'
import { Input } from '@/components/Input/Input'
import { Switch } from '@/components/Switch/Switch'
import { Textarea } from '@/components/Textarea/Textarea'
import type {
  FeedbackRecord,
  FeedbackRecordRead,
  FeedbackSection as FeedbackSectionData,
  ProfileSectionEnvelope,
  SectionAccessLevel,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'
import {
  isWritableFeedback,
  useAddFeedbackForm,
  useFeedbackItem,
} from './hooks/useFeedbackSection'
import { todayCalendarDate } from './schemas/feedback-form.schema'

interface FeedbackSectionCardProps {
  employeeId: string
  section: ProfileSectionEnvelope<FeedbackSectionData>
  accessLevel: Exclude<SectionAccessLevel, 'none'>
}

export const FeedbackSectionCard = ({
  employeeId,
  section,
  accessLevel,
}: FeedbackSectionCardProps) => {
  const { t } = useTranslation()

  if (!isSectionData<FeedbackSectionData>(section)) {
    return null
  }

  const { records } = section.data
  const canWrite = accessLevel === 'RW'

  return (
    <div className="space-y-4" data-testid="feedback-section">
      {records.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('employeeProfile.s8.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {records.map(record => (
            <FeedbackRecordItem
              key={record.id}
              employeeId={employeeId}
              record={record}
              canWrite={canWrite}
            />
          ))}
        </ul>
      )}

      {canWrite && <AddFeedbackForm employeeId={employeeId} />}
    </div>
  )
}

const FeedbackRecordItem = ({
  employeeId,
  record,
  canWrite,
}: {
  employeeId: string
  record: FeedbackRecordRead | FeedbackRecord
  canWrite: boolean
}) => {
  const { t } = useTranslation()
  const {
    form,
    onSubmit,
    isMutating,
    toggleSharedWithEmployee,
    handleDelete,
  } = useFeedbackItem(employeeId, record)

  return (
    <li
      className="rounded-md border border-border p-3 text-sm"
      data-testid={`feedback-record-${record.id}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{record.author.displayName}</span>
        <span>{record.recordedAt}</span>
      </div>
      <p className="mt-1 font-medium text-foreground">{record.context}</p>

      {canWrite ? (
        <Form form={form} onSubmit={onSubmit} className="mt-2 space-y-2">
          <Input name="context" label={t('employeeProfile.s8.context')} />
          <Textarea name="body" className="min-h-20" />
          {isWritableFeedback(record) && (
            <Switch
              checked={record.sharedWithEmployee}
              disabled={isMutating}
              label={t('employeeProfile.s8.toggleSharedWithEmployee')}
              onCheckedChange={checked => {
                void toggleSharedWithEmployee(checked)
              }}
              data-testid={`feedback-record-${record.id}-shared-employee`}
            />
          )}
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
              {t('employeeProfile.s8.deleteRecord')}
            </Button>
          </div>
        </Form>
      ) : (
        <p className="mt-2 whitespace-pre-wrap">{record.body}</p>
      )}
    </li>
  )
}

const AddFeedbackForm = ({ employeeId }: { employeeId: string }) => {
  const { t } = useTranslation()
  const { form, onSubmit, isCreatingFeedback } = useAddFeedbackForm(employeeId)

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="space-y-2 border-t border-border pt-4"
    >
      <h3 className="text-sm font-medium text-foreground">
        {t('employeeProfile.s8.addRecord')}
      </h3>
      <Input
        name="recordedAt"
        type="date"
        max={todayCalendarDate()}
        label={t('employeeProfile.s8.recordedAt')}
        data-testid="feedback-add-recorded-at"
      />
      <Input
        name="context"
        label={t('employeeProfile.s8.context')}
        data-testid="feedback-add-context"
      />
      <Textarea
        name="body"
        className="min-h-20"
        data-testid="feedback-add-body"
      />
      <Switch
        name="sharedWithEmployee"
        disabled={isCreatingFeedback}
        label={t('employeeProfile.s8.toggleSharedWithEmployee')}
        data-testid="feedback-add-shared-employee"
      />
      <FormRootError />
      <Button type="submit" size="sm" disabled={isCreatingFeedback}>
        {t('employeeProfile.s8.addRecord')}
      </Button>
    </Form>
  )
}
