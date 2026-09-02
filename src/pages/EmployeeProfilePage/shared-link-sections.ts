import type { SectionId } from '@/types/employee-profile'

/** cfg sections offered in the Shared Link Manager (never sections omitted). */
export const SHAREABLE_CFG_SECTIONS: SectionId[] = [
  'S2',
  'S4',
  'S5',
  'S6',
  'S8',
  'S9',
  'S10',
  'S11',
  'S12',
  'S15',
  'S16',
]

export const SHAREABLE_SECTION_TITLE_KEYS: Record<SectionId, string> = {
  S1: 'employeeProfile.sections.identity',
  S2: 'employeeProfile.sections.generic',
  S3: 'employeeProfile.sections.generic',
  S4: 'employeeProfile.sections.generic',
  S5: 'employeeProfile.sections.generic',
  S6: 'employeeProfile.sections.generic',
  S7: 'employeeProfile.sections.managementNotes',
  S8: 'employeeProfile.sections.generic',
  S9: 'employeeProfile.sections.timeline',
  S10: 'employeeProfile.sections.leaves',
  S11: 'employeeProfile.sections.projects',
  S12: 'employeeProfile.sections.generic',
  S13: 'employeeProfile.sections.generic',
  S14: 'employeeProfile.sections.generic',
  S15: 'employeeProfile.sections.generic',
  S16: 'employeeProfile.sections.customFields',
}

export const LINK_CREATOR_ROLES = new Set([
  'ReportingLine',
  'ProjectLine',
  'PP',
])

export const LINK_MANAGE_ROLES = new Set([
  'ReportingLine',
  'ProjectLine',
  'PP',
  'FullAccess',
])
