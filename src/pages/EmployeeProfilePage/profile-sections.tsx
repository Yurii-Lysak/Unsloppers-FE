import type { ReactNode } from 'react'
import type {
  AccessRole,
  CustomFieldsSection as CustomFieldsSectionData,
  EmployeeProfile,
  FeedbackSection as FeedbackSectionData,
  LeavesSection,
  ManagementNotesSection as ManagementNotesSectionData,
  MentorshipSection as MentorshipSectionData,
  ProfileSectionEnvelope,
  ProjectsSection,
  CdsSection as CdsSectionData,
  EmploymentSection,
  DocumentsSection as DocumentsSectionData,
  EmergencyContactsSection as EmergencyContactsSectionData,
  PersonalContactsSection as PersonalContactsSectionData,
  RequestHistorySection as RequestHistorySectionData,
  RisksSection as RisksSectionData,
  SectionAccessLevel,
  SectionId,
  TimelineSection,
} from '@/types/employee-profile'
import { CustomFieldsSectionCard } from './components/CustomFieldsSection/CustomFieldsSection'
import { FeedbackSectionCard } from './components/FeedbackSection/FeedbackSection'
import { ManagementNotesSectionCard } from './components/ManagementNotesSection/ManagementNotesSection'
import { MentorshipSectionCard } from './components/MentorshipSection/MentorshipSection'
import { CdsSectionCard } from './components/CdsSection/CdsSection'
import { DocumentsSectionCard } from './components/DocumentsSection/DocumentsSection'
import { EmergencyContactsSectionCard } from './components/EmergencyContactsSection/EmergencyContactsSection'
import { PersonalContactsSectionCard } from './components/PersonalContactsSection/PersonalContactsSection'
import { RequestHistorySectionCard } from './components/RequestHistorySection/RequestHistorySection'
import { RisksSectionCard } from './components/RisksSection/RisksSection'

export const PROFILE_SECTION_ORDER: SectionId[] = [
  'S1',
  'S2',
  'S3',
  'S4',
  'S5',
  'S6',
  'S7',
  'S8',
  'S9',
  'S10',
  'S11',
  'S12',
  'S13',
  'S14',
  'S15',
  'S16',
]

const EMPLOYMENT_FIELD_KEYS: Array<{
  key: keyof EmploymentSection
  labelKey:
    | 'employeeProfile.sections.employment.fields.grade'
    | 'employeeProfile.sections.employment.fields.position'
    | 'employeeProfile.sections.employment.fields.seniority'
    | 'employeeProfile.sections.employment.fields.employmentType'
    | 'employeeProfile.sections.employment.fields.englishLevel'
    | 'employeeProfile.sections.employment.fields.probationStatus'
    | 'employeeProfile.sections.employment.fields.contractType'
}> = [
  { key: 'grade', labelKey: 'employeeProfile.sections.employment.fields.grade' },
  {
    key: 'position',
    labelKey: 'employeeProfile.sections.employment.fields.position',
  },
  {
    key: 'seniority',
    labelKey: 'employeeProfile.sections.employment.fields.seniority',
  },
  {
    key: 'employmentType',
    labelKey: 'employeeProfile.sections.employment.fields.employmentType',
  },
  {
    key: 'englishLevel',
    labelKey: 'employeeProfile.sections.employment.fields.englishLevel',
  },
  {
    key: 'probationStatus',
    labelKey: 'employeeProfile.sections.employment.fields.probationStatus',
  },
  {
    key: 'contractType',
    labelKey: 'employeeProfile.sections.employment.fields.contractType',
  },
]

export const PROFILE_SECTION_TITLE_KEYS: Partial<Record<SectionId, string>> = {
  S1: 'employeeProfile.sections.identity',
  S2: 'employeeProfile.sections.personalContacts.title',
  S3: 'employeeProfile.sections.emergencyContacts.title',
  S4: 'employeeProfile.sections.employment.title',
  S5: 'employeeProfile.sections.documents.title',
  S6: 'employeeProfile.sections.risks',
  S7: 'employeeProfile.sections.managementNotes',
  S8: 'employeeProfile.sections.feedback',
  S9: 'employeeProfile.sections.timeline',
  S10: 'employeeProfile.sections.leaves.title',
  S11: 'employeeProfile.sections.projects.title',
  S12: 'employeeProfile.sections.cds',
  S13: 'employeeProfile.sections.mentorship',
  S15: 'employeeProfile.sections.requestHistory',
  S16: 'employeeProfile.sections.customFields',
}

export const isSectionData = <T,>(
  section: ProfileSectionEnvelope<unknown> | undefined,
): section is ProfileSectionEnvelope<T> & { data: T } =>
  Boolean(section && 'data' in section)

export const orderedProfileSectionIds = (
  sections: EmployeeProfile['sections'],
): SectionId[] =>
  PROFILE_SECTION_ORDER.filter((sectionId) => sectionId in sections)

type SectionRenderer = (props: {
  employeeId: string
  section: ProfileSectionEnvelope<unknown>
  accessLevel: Exclude<SectionAccessLevel, 'none'>
  subjectDisplayName: string
  audienceRole: AccessRole
  t: (key: string) => string
}) => ReactNode

export const PROFILE_SECTION_RENDERERS: Partial<Record<SectionId, SectionRenderer>> =
  {
    S1: () => null,
    S2: ({ employeeId, section, accessLevel }) => (
      <PersonalContactsSectionCard
        employeeId={employeeId}
        section={section as ProfileSectionEnvelope<PersonalContactsSectionData>}
        accessLevel={accessLevel}
      />
    ),
    S3: ({ employeeId, section, accessLevel }) => (
      <EmergencyContactsSectionCard
        employeeId={employeeId}
        section={section as ProfileSectionEnvelope<EmergencyContactsSectionData>}
        accessLevel={accessLevel}
      />
    ),
    S5: ({ employeeId, section, accessLevel, audienceRole }) => (
      <DocumentsSectionCard
        employeeId={employeeId}
        section={section as ProfileSectionEnvelope<DocumentsSectionData>}
        accessLevel={accessLevel}
        audienceRole={audienceRole}
      />
    ),
    S4: ({ section, t }) => {
      if (!isSectionData<EmploymentSection>(section)) {
        return null
      }

      const notSetLabel = t('employeeProfile.sections.employment.notSet')

      return (
        <dl className="space-y-2 text-sm">
          {EMPLOYMENT_FIELD_KEYS.map(({ key, labelKey }) => {
            const value = section.data[key]
            const displayValue =
              value === null || value.trim() === '' ? notSetLabel : value

            return (
              <div key={key} className="grid gap-1 sm:grid-cols-[minmax(0,12rem)_1fr]">
                <dt className="font-medium text-foreground">{t(labelKey)}</dt>
                <dd
                  className="text-muted-foreground"
                  data-testid={`employment-field-${key}`}
                >
                  {displayValue}
                </dd>
              </div>
            )
          })}
        </dl>
      )
    },
    S6: ({ employeeId, section, accessLevel }) => (
      <RisksSectionCard
        employeeId={employeeId}
        section={section as ProfileSectionEnvelope<RisksSectionData>}
        accessLevel={accessLevel}
      />
    ),
    S7: ({ employeeId, section, accessLevel }) => (
      <ManagementNotesSectionCard
        employeeId={employeeId}
        section={section as ProfileSectionEnvelope<ManagementNotesSectionData>}
        accessLevel={accessLevel}
      />
    ),
    S8: ({ employeeId, section, accessLevel, subjectDisplayName, audienceRole }) => (
      <FeedbackSectionCard
        key={employeeId}
        employeeId={employeeId}
        section={section as ProfileSectionEnvelope<FeedbackSectionData>}
        accessLevel={accessLevel}
        subjectDisplayName={subjectDisplayName}
        audienceRole={audienceRole}
      />
    ),
    S9: ({ section, t }) => {
      if (!isSectionData<TimelineSection>(section)) {
        return null
      }
      return section.data.events.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('employeeProfile.emptySection')}
        </p>
      ) : (
        <ul className="space-y-2 text-sm">
          {section.data.events.map((event) => (
            <li key={event.id}>
              {event.type} — {event.effectiveDate}
            </li>
          ))}
        </ul>
      )
    },
    S10: ({ section, t }) => {
      if (!isSectionData<LeavesSection>(section)) {
        return null
      }

      if (section.data.availability === 'unavailable') {
        return (
          <p
            className="text-sm text-muted-foreground"
            data-testid="leaves-unavailable"
          >
            {t('employeeProfile.sections.leaves.unavailable')}
          </p>
        )
      }

      return (
        <div className="space-y-2 text-sm">
          {section.data.leaves.length === 0 ? (
            <p className="text-muted-foreground">
              {t('employeeProfile.emptySection')}
            </p>
          ) : (
            <ul className="space-y-2">
              {section.data.leaves.map((leave, index) => (
                <li key={`${leave.startDate}-${leave.endDate}-${index}`}>
                  {leave.startDate} — {leave.endDate}
                </li>
              ))}
            </ul>
          )}
          {section.data.manageLeaveUrl ? (
            <a
              href={section.data.manageLeaveUrl}
              className="text-primary underline"
              data-testid="leaves-manage-link"
              target="_blank"
              rel="noreferrer"
            >
              {t('employeeProfile.sections.leaves.manageLink')}
            </a>
          ) : null}
        </div>
      )
    },
    S11: ({ section, t }) => {
      if (!isSectionData<ProjectsSection>(section)) {
        return null
      }

      const notSetLabel = t('employeeProfile.sections.projects.notSet')
      const ongoingLabel = t('employeeProfile.sections.projects.ongoing')

      return section.data.projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('employeeProfile.emptySection')}
        </p>
      ) : (
        <ul className="space-y-3 text-sm">
          {section.data.projects.map((project, index) => (
            <li key={`${project.name}-${index}`} data-testid={`project-entry-${index}`}>
              <div className="font-medium">{project.name}</div>
              {project.pm !== undefined ? (
                <div className="text-muted-foreground">
                  {t('employeeProfile.sections.projects.pm')}:{' '}
                  {project.pm ?? notSetLabel}
                </div>
              ) : null}
              {project.dm !== undefined ? (
                <div className="text-muted-foreground">
                  {t('employeeProfile.sections.projects.dm')}:{' '}
                  {project.dm ?? notSetLabel}
                </div>
              ) : null}
              {project.startDate !== undefined ? (
                <div className="text-muted-foreground">
                  {t('employeeProfile.sections.projects.period')}:{' '}
                  {project.startDate} — {project.endDate ?? ongoingLabel}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )
    },
    S16: ({ section }) => (
      <CustomFieldsSectionCard
        section={section as ProfileSectionEnvelope<CustomFieldsSectionData>}
      />
    ),
    S13: ({ employeeId, section, accessLevel, audienceRole }) => (
      <MentorshipSectionCard
        employeeId={employeeId}
        section={section as ProfileSectionEnvelope<MentorshipSectionData>}
        accessLevel={accessLevel}
        audienceRole={audienceRole}
      />
    ),
    S12: ({ employeeId, section, accessLevel, audienceRole }) => (
      <CdsSectionCard
        employeeId={employeeId}
        section={section as ProfileSectionEnvelope<CdsSectionData>}
        accessLevel={accessLevel}
        audienceRole={audienceRole}
      />
    ),
    S15: ({ section }) => (
      <RequestHistorySectionCard
        section={section as ProfileSectionEnvelope<RequestHistorySectionData>}
      />
    ),
  }
