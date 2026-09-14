import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { FormRootError } from '@/components/Form/components/FormRootError/FormRootError'
import { Input } from '@/components/Input/Input'
import { Select } from '@/components/Select/Select'
import {
  TIMELINE_EVENT_TYPES,
  type ProfileSectionEnvelope,
  type SectionAccessLevel,
  type TimelineEvent,
  type TimelineSection as TimelineSectionData,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'
import {
  useAddTimelineEventForm,
  useTimelineEventItem,
} from './hooks/useCareerTimelineSection'

interface CareerTimelineSectionCardProps {
  employeeId: string
  section: ProfileSectionEnvelope<unknown>
  accessLevel: Exclude<SectionAccessLevel, 'none'>
}

const formatEffectiveDate = (value: string): string => {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
  const parsed = new Date(isDateOnly ? `${value}T00:00:00.000Z` : value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }
  return parsed.toLocaleDateString(undefined, { timeZone: 'UTC' })
}

const eventTypeLabelKey = (
  type: string,
):
  | 'employeeProfile.s9.eventTypes.grade'
  | 'employeeProfile.s9.eventTypes.position'
  | 'employeeProfile.s9.eventTypes.department'
  | 'employeeProfile.s9.eventTypes.employmentType'
  | 'employeeProfile.s9.eventTypes.joining'
  | 'employeeProfile.s9.eventTypes.extendedLeave'
  | 'employeeProfile.s9.eventTypes.mentorshipStart'
  | 'employeeProfile.s9.eventTypes.mentorshipEnd'
  | null => {
  switch (type) {
    case 'grade':
      return 'employeeProfile.s9.eventTypes.grade'
    case 'position':
      return 'employeeProfile.s9.eventTypes.position'
    case 'department':
      return 'employeeProfile.s9.eventTypes.department'
    case 'employmentType':
      return 'employeeProfile.s9.eventTypes.employmentType'
    case 'joining':
      return 'employeeProfile.s9.eventTypes.joining'
    case 'extendedLeave':
      return 'employeeProfile.s9.eventTypes.extendedLeave'
    case 'mentorshipStart':
      return 'employeeProfile.s9.eventTypes.mentorshipStart'
    case 'mentorshipEnd':
      return 'employeeProfile.s9.eventTypes.mentorshipEnd'
    default:
      return null
  }
}

export const CareerTimelineSectionCard = ({
  employeeId,
  section,
  accessLevel,
}: CareerTimelineSectionCardProps) => {
  const { t } = useTranslation()

  if (!isSectionData<TimelineSectionData>(section)) {
    return null
  }

  const { events } = section.data
  const canWrite = accessLevel === 'RW'

  return (
    <div className="space-y-4" data-testid="career-timeline-section">
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('employeeProfile.emptySection')}
        </p>
      ) : (
        <ul className="space-y-2 text-sm">
          {events.map(event => (
            <TimelineEventRow
              key={event.id}
              employeeId={employeeId}
              event={event}
              canWrite={canWrite}
            />
          ))}
        </ul>
      )}

      {canWrite && <AddTimelineEventForm employeeId={employeeId} />}
    </div>
  )
}

const TimelineEventDisplay = ({
  event,
  canWrite,
}: {
  event: TimelineEvent
  canWrite: boolean
}) => {
  const { t } = useTranslation()

  const labelKey = eventTypeLabelKey(event.type)
  const label = labelKey ? t(labelKey) : event.type

  const hasOldValue = event.oldValue !== null && event.oldValue !== undefined
  const hasNewValue = event.newValue !== null && event.newValue !== undefined

  let change: string | null = null
  if (hasOldValue && hasNewValue) {
    change = t('employeeProfile.s9.changeWithValues', {
      oldValue: event.oldValue,
      newValue: event.newValue,
    })
  } else if (hasNewValue) {
    change = t('employeeProfile.s9.changeToValue', { newValue: event.newValue })
  }

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">
          {formatEffectiveDate(event.effectiveDate)}
        </p>
      </div>
      {change ? <p className="mt-1 text-muted-foreground">{change}</p> : null}
      {canWrite && event.source === 'manual' ? (
        <p className="mt-1 text-xs text-muted-foreground">
          {t('employeeProfile.s9.sourceManual')}
        </p>
      ) : null}
    </>
  )
}

const TimelineEventRow = ({
  employeeId,
  event,
  canWrite,
}: {
  employeeId: string
  event: TimelineEvent
  canWrite: boolean
}) => {
  const { t } = useTranslation()
  const { form, onSubmit, isMutating, handleDelete } = useTimelineEventItem(
    employeeId,
    event,
  )

  const isEditable = canWrite && event.source === 'manual'

  if (!isEditable) {
    return (
      <li
        className="rounded-md border border-border p-3"
        data-testid={`career-timeline-event-${event.id}`}
      >
        <TimelineEventDisplay event={event} canWrite={canWrite} />
      </li>
    )
  }

  const typeOptions = TIMELINE_EVENT_TYPES.map(type => ({
    value: type,
    label: t(eventTypeLabelKey(type) ?? 'employeeProfile.s9.fields.type'),
  }))

  return (
    <li
      className="rounded-md border border-border p-3"
      data-testid={`career-timeline-event-${event.id}`}
    >
      <Form form={form} onSubmit={onSubmit} className="space-y-2">
        <Select
          name="type"
          label={t('employeeProfile.s9.fields.type')}
          options={typeOptions}
        />
        <Input
          name="effectiveDate"
          type="date"
          label={t('employeeProfile.s9.fields.effectiveDate')}
        />
        <Input name="oldValue" label={t('employeeProfile.s9.fields.oldValue')} />
        <Input name="newValue" label={t('employeeProfile.s9.fields.newValue')} />
        <FormRootError />
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm" disabled={isMutating}>
            {t('employeeProfile.save')}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isMutating}
            onClick={() => {
              void handleDelete()
            }}
          >
            {t('employeeProfile.s9.deleteButton')}
          </Button>
        </div>
      </Form>
    </li>
  )
}

const AddTimelineEventForm = ({ employeeId }: { employeeId: string }) => {
  const { t } = useTranslation()
  const { form, onSubmit, isCreatingTimelineEvent } = useAddTimelineEventForm(employeeId)

  const typeOptions = TIMELINE_EVENT_TYPES.map(type => ({
    value: type,
    label: t(eventTypeLabelKey(type) ?? 'employeeProfile.s9.fields.type'),
  }))

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="space-y-2 border-t border-border pt-4"
    >
      <h3 className="text-sm font-medium text-foreground">
        {t('employeeProfile.s9.addHeading')}
      </h3>
      <Select
        name="type"
        label={t('employeeProfile.s9.fields.type')}
        options={typeOptions}
        data-testid="timeline-add-type"
      />
      <Input
        name="effectiveDate"
        type="date"
        label={t('employeeProfile.s9.fields.effectiveDate')}
        data-testid="timeline-add-effective-date"
      />
      <Input
        name="oldValue"
        label={t('employeeProfile.s9.fields.oldValue')}
        data-testid="timeline-add-old-value"
      />
      <Input
        name="newValue"
        label={t('employeeProfile.s9.fields.newValue')}
        data-testid="timeline-add-new-value"
      />
      <FormRootError />
      <Button
        type="submit"
        size="sm"
        disabled={isCreatingTimelineEvent}
        data-testid="timeline-add-submit"
      >
        {t('employeeProfile.s9.addSubmit')}
      </Button>
    </Form>
  )
}
