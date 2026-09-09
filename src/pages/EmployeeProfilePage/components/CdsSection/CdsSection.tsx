import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Form } from '@/components/Form/Form'
import { FormRootError } from '@/components/Form/components/FormRootError/FormRootError'
import { Input } from '@/components/Input/Input'
import { Textarea } from '@/components/Textarea/Textarea'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'
import type {
  AccessRole,
  CdsAssessmentEntry,
  CdsSection as CdsSectionData,
  IdpRecord,
  ProfileSectionEnvelope,
  SectionAccessLevel,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'
import {
  useAddCdsAssessmentForm,
  useAddIdpRecordForm,
  useCdsAssessmentConclusionEdit,
  useCompleteIdpRecord,
  useIdpRecordItem,
} from './hooks/useCdsSection'

interface CdsSectionCardProps {
  employeeId: string
  section: ProfileSectionEnvelope<CdsSectionData>
  accessLevel: Exclude<SectionAccessLevel, 'none'>
  audienceRole: AccessRole
}

export const CdsSectionCard = ({
  employeeId,
  section,
  accessLevel,
  audienceRole,
}: CdsSectionCardProps) => {
  const { t } = useTranslation()
  const { canMaintainCdsRecords } = usePermissionsData()

  if (!isSectionData<CdsSectionData>(section)) {
    return null
  }

  const { matrixLink, assessments, idpRecords } = section.data
  const assessmentEntries = Array.isArray(assessments) ? assessments : []
  const idpEntries = Array.isArray(idpRecords) ? idpRecords : []
  const canWriteCds = accessLevel === 'RW' || canMaintainCdsRecords
  const canCompleteIdp = audienceRole === 'Self'

  return (
    <div className="space-y-6" data-testid="cds-section">
      <div>
        <h3 className="text-sm font-medium text-foreground">
          {t('employeeProfile.s12.matrixLinkHeading')}
        </h3>
        {matrixLink ? (
          <a
            href={matrixLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary underline-offset-4 hover:underline"
            data-testid="cds-matrix-link"
          >
            {t('employeeProfile.s12.matrixLink')}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground" data-testid="cds-matrix-empty">
            {t('employeeProfile.s12.noMatrixLink')}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">
          {t('employeeProfile.s12.idp.heading')}
        </h3>

        {idpEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground" data-testid="cds-idp-empty">
            {t('employeeProfile.s12.idp.empty')}
          </p>
        ) : (
          <ul className="space-y-3">
            {idpEntries.map(record => (
              <IdpRecordItem
                key={record.id}
                employeeId={employeeId}
                record={record}
                canWrite={canWriteCds}
                canComplete={canCompleteIdp}
              />
            ))}
          </ul>
        )}

        {canWriteCds && <AddIdpRecordForm employeeId={employeeId} />}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">
          {t('employeeProfile.s12.assessmentsHeading')}
        </h3>

        {assessmentEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground" data-testid="cds-assessments-empty">
            {t('employeeProfile.s12.empty')}
          </p>
        ) : (
          <ul className="space-y-3">
            {assessmentEntries.map(entry => (
              <CdsAssessmentEntryItem
                key={entry.id}
                employeeId={employeeId}
                entry={entry}
                canWrite={canWriteCds}
              />
            ))}
          </ul>
        )}

        {canWriteCds && <AddCdsAssessmentForm employeeId={employeeId} />}
      </div>
    </div>
  )
}

const formatDisplayDate = (value: string) => {
  const calendarMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (calendarMatch) {
    const year = Number(calendarMatch[1])
    const month = Number(calendarMatch[2])
    const day = Number(calendarMatch[3])
    const date = new Date(year, month - 1, day)
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const IdpRecordItem = ({
  employeeId,
  record,
  canWrite,
  canComplete,
}: {
  employeeId: string
  record: IdpRecord
  canWrite: boolean
  canComplete: boolean
}) => {
  const { t } = useTranslation()
  const isCompleted = record.completedAt !== null
  const { form, onSubmit, isUpdatingIdpRecord } = useIdpRecordItem(
    employeeId,
    record,
  )
  const { handleComplete, isCompletingIdpRecord } = useCompleteIdpRecord(employeeId)
  const [completingRecordId, setCompletingRecordId] = useState<string | null>(null)
  const isCompletingThisRecord =
    isCompletingIdpRecord && completingRecordId === record.id

  const onCompleteChecked = async (checked: boolean) => {
    if (!checked) {
      return
    }

    setCompletingRecordId(record.id)
    try {
      await handleComplete(record.id)
    } finally {
      setCompletingRecordId(current =>
        current === record.id ? null : current,
      )
    }
  }

  return (
    <li
      className="rounded-md border border-border p-3 text-sm"
      data-testid={`cds-idp-record-${record.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-foreground">
            {t('employeeProfile.s12.idp.deadline', {
              date: formatDisplayDate(record.deadline),
            })}
          </p>
          {isCompleted ? (
            <span
              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              data-testid={`cds-idp-status-${record.id}`}
            >
              {t('employeeProfile.s12.idp.statusComplete')}
            </span>
          ) : null}
        </div>
        <a
          href={record.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          {t('employeeProfile.s12.idp.fileLink')}
        </a>
      </div>

      {isCompleted ? (
        <>
          <p className="mt-2 text-foreground">{record.description}</p>
          <p className="mt-2 text-muted-foreground">
            {t('employeeProfile.s12.idp.completedAt', {
              date: formatDisplayDate(record.completedAt ?? ''),
            })}
          </p>
        </>
      ) : canWrite ? (
        <Form form={form} onSubmit={onSubmit} className="mt-2 space-y-2">
          <Textarea name="description" className="min-h-20" />
          <Input
            name="deadline"
            type="date"
            label={t('employeeProfile.s12.idp.deadlineLabel')}
          />
          <Input
            name="fileUrl"
            label={t('employeeProfile.s12.idp.fileUrlLabel')}
          />
          <FormRootError />
          <Button
            type="submit"
            size="sm"
            disabled={isUpdatingIdpRecord || !form.formState.isDirty}
          >
            {t('employeeProfile.save')}
          </Button>
        </Form>
      ) : (
        <p className="mt-2 text-foreground">{record.description}</p>
      )}

      {canComplete && !isCompleted && !isCompletingThisRecord ? (
        <div className="mt-3">
          <Checkbox
            checked={false}
            disabled={isCompletingIdpRecord}
            label={t('employeeProfile.s12.idp.completeLabel')}
            onCheckedChange={checked => {
              void onCompleteChecked(checked)
            }}
            data-testid={`cds-idp-complete-${record.id}`}
          />
        </div>
      ) : null}
    </li>
  )
}

const AddIdpRecordForm = ({ employeeId }: { employeeId: string }) => {
  const { t } = useTranslation()
  const { form, onSubmit, isCreatingIdpRecord } = useAddIdpRecordForm(employeeId)

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="space-y-2 border-t border-border pt-4"
    >
      <h3 className="text-sm font-medium text-foreground">
        {t('employeeProfile.s12.idp.addRecord')}
      </h3>
      <Textarea
        name="description"
        label={t('employeeProfile.s12.idp.descriptionLabel')}
        className="min-h-20"
      />
      <Input
        name="deadline"
        type="date"
        label={t('employeeProfile.s12.idp.deadlineLabel')}
      />
      <Input
        name="fileUrl"
        label={t('employeeProfile.s12.idp.fileUrlLabel')}
      />
      <FormRootError />
      <Button type="submit" size="sm" disabled={isCreatingIdpRecord}>
        {t('employeeProfile.s12.idp.addRecord')}
      </Button>
    </Form>
  )
}

const AddCdsAssessmentForm = ({ employeeId }: { employeeId: string }) => {
  const { t } = useTranslation()
  const { form, onSubmit, isCreatingAssessment } = useAddCdsAssessmentForm(employeeId)

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="space-y-2 border-t border-border pt-4"
    >
      <h3 className="text-sm font-medium text-foreground">
        {t('employeeProfile.s12.addAssessment.heading')}
      </h3>
      <Input
        name="date"
        type="date"
        label={t('employeeProfile.s12.addAssessment.dateLabel')}
      />
      <Input
        name="assessor"
        label={t('employeeProfile.s12.addAssessment.assessorLabel')}
      />
      <Input
        name="resultLink"
        label={t('employeeProfile.s12.addAssessment.resultLinkLabel')}
      />
      <Textarea
        name="conclusion"
        label={t('employeeProfile.s12.addAssessment.conclusionLabel')}
        className="min-h-20"
      />
      <FormRootError />
      <Button type="submit" size="sm" disabled={isCreatingAssessment}>
        {t('employeeProfile.s12.addAssessment.submit')}
      </Button>
    </Form>
  )
}

const CdsAssessmentEntryItem = ({
  employeeId,
  entry,
  canWrite,
}: {
  employeeId: string
  entry: CdsAssessmentEntry
  canWrite: boolean
}) => {
  const { t } = useTranslation()
  const { form, onSubmit, isUpdatingAssessmentConclusion } =
    useCdsAssessmentConclusionEdit(employeeId, entry)

  return (
    <li
      className="rounded-md border border-border p-3 text-sm"
      data-testid={`cds-assessment-entry-${entry.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium text-foreground">
          {t('employeeProfile.s12.date', { date: formatDisplayDate(entry.date) })}
        </p>
        <a
          href={entry.resultLink}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          {t('employeeProfile.s12.resultLink')}
        </a>
      </div>
      <p className="mt-2 text-muted-foreground">
        {t('employeeProfile.s12.assessor', { name: entry.assessor })}
      </p>
      {canWrite ? (
        <Form form={form} onSubmit={onSubmit} className="mt-2 space-y-2">
          <Textarea
            name="conclusion"
            label={t('employeeProfile.s12.editConclusion.label')}
            className="min-h-20"
          />
          <FormRootError />
          <Button
            type="submit"
            size="sm"
            disabled={isUpdatingAssessmentConclusion || !form.formState.isDirty}
          >
            {t('employeeProfile.save')}
          </Button>
        </Form>
      ) : (
        <p className="mt-2 text-foreground">{entry.conclusion}</p>
      )}
    </li>
  )
}
