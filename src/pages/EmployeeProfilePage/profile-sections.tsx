import type { ReactNode } from 'react'
import type {
  CustomFieldsSection as CustomFieldsSectionData,
  EmployeeProfile,
  LeavesSection,
  ManagementNotesSection as ManagementNotesSectionData,
  ProfileSectionEnvelope,
  ProjectsSection,
  SectionAccessLevel,
  SectionId,
  TimelineSection,
} from '@/types/employee-profile'
import { CustomFieldsSectionCard } from './components/CustomFieldsSection/CustomFieldsSection'
import { ManagementNotesSectionCard } from './components/ManagementNotesSection/ManagementNotesSection'

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

export const PROFILE_SECTION_TITLE_KEYS: Partial<Record<SectionId, string>> = {
  S1: 'employeeProfile.sections.identity',
  S7: 'employeeProfile.sections.managementNotes',
  S9: 'employeeProfile.sections.timeline',
  S10: 'employeeProfile.sections.leaves',
  S11: 'employeeProfile.sections.projects',
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
  t: (key: string) => string
}) => ReactNode

export const PROFILE_SECTION_RENDERERS: Partial<Record<SectionId, SectionRenderer>> =
  {
    S1: () => null,
    S7: ({ employeeId, section, accessLevel }) => (
      <ManagementNotesSectionCard
        employeeId={employeeId}
        section={section as ProfileSectionEnvelope<ManagementNotesSectionData>}
        accessLevel={accessLevel}
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
      return section.data.leaves.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('employeeProfile.emptySection')}
        </p>
      ) : (
        <ul className="space-y-2 text-sm">
          {section.data.leaves.map((leave, index) => (
            <li key={`${leave.startDate}-${leave.endDate}-${index}`}>
              {leave.startDate} — {leave.endDate}
            </li>
          ))}
        </ul>
      )
    },
    S11: ({ section, t }) => {
      if (!isSectionData<ProjectsSection>(section)) {
        return null
      }
      return section.data.projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('employeeProfile.emptySection')}
        </p>
      ) : (
        <ul className="space-y-1 text-sm">
          {section.data.projects.map((project, index) => (
            <li key={`${project.name}-${index}`}>{project.name}</li>
          ))}
        </ul>
      )
    },
    S16: ({ section }) => (
      <CustomFieldsSectionCard
        section={section as ProfileSectionEnvelope<CustomFieldsSectionData>}
      />
    ),
  }
