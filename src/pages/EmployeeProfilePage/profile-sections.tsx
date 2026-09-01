import type { ReactNode } from 'react'
import type { SectionId } from '@/types/employee-profile'
import type {
  EmployeeProfile,
  IdentitySection,
  LeavesSection,
  ProfileSectionEnvelope,
  ProjectsSection,
  TimelineSection,
} from '@/types/employee-profile'

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
  S9: 'employeeProfile.sections.timeline',
  S10: 'employeeProfile.sections.leaves',
  S11: 'employeeProfile.sections.projects',
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
  section: ProfileSectionEnvelope<unknown>
  t: (key: string) => string
}) => ReactNode

export const PROFILE_SECTION_RENDERERS: Partial<Record<SectionId, SectionRenderer>> =
  {
    S1: ({ section, t }) => {
      if (!isSectionData<IdentitySection>(section)) {
        return null
      }
      return (
        <dl className="grid gap-2 text-sm">
          {section.data.manager && (
            <div>
              <dt className="text-muted-foreground">
                {t('employeeProfile.fields.manager')}
              </dt>
              <dd>{section.data.manager.displayName}</dd>
            </div>
          )}
          {section.data.peoplePartner && (
            <div>
              <dt className="text-muted-foreground">
                {t('employeeProfile.fields.peoplePartner')}
              </dt>
              <dd>{section.data.peoplePartner.displayName}</dd>
            </div>
          )}
        </dl>
      )
    },
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
  }
