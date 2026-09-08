import type { AccessRole, SectionAccessLevel } from '@/types/employee-profile'

const REQUEST_FEEDBACK_AUDIENCE_ROLES = new Set<AccessRole>(['ReportingLine', 'PP'])

export const canRequestFeedbackFromProfile = (
  accessLevel: SectionAccessLevel,
  audienceRole: AccessRole,
): boolean =>
  accessLevel === 'RW' && REQUEST_FEEDBACK_AUDIENCE_ROLES.has(audienceRole)
