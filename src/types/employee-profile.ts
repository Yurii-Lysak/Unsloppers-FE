export type SectionId =
  | 'S1'
  | 'S2'
  | 'S3'
  | 'S4'
  | 'S5'
  | 'S6'
  | 'S7'
  | 'S8'
  | 'S9'
  | 'S10'
  | 'S11'
  | 'S12'
  | 'S13'
  | 'S14'
  | 'S15'
  | 'S16'

export type SectionAccessLevel = 'R' | 'RW' | 'none'

export type AccessRole =
  | 'Self'
  | 'ReportingLine'
  | 'ProjectLine'
  | 'PP'
  | 'Colleague'
  | 'SharedLink'
  | 'FullAccess'

export interface ManagementNoteAuthor {
  id: string
  displayName: string
}

export interface ManagementNoteRead {
  id: string
  content: string
  author: ManagementNoteAuthor
  createdAt: string
  updatedAt: string
}

export interface ManagementNote extends ManagementNoteRead {
  visibleForEmployee: boolean
  visibleForPm: boolean
}

export interface ManagementNotesSection {
  notes: ManagementNoteRead[] | ManagementNote[]
  hasHiddenNotes?: boolean
}

export interface IdentityRelation {
  id: string
  displayName: string
}

export interface IdentitySection {
  displayName: string
  manager?: IdentityRelation | null
  peoplePartner?: IdentityRelation | null
  mentor?: IdentityRelation | null
}

export interface LeavePeriod {
  type?: string | null
  startDate: string
  endDate: string
  approvalState?: string | null
}

export interface LeavesSection {
  leaves: LeavePeriod[]
  manageLeaveUrl?: string | null
}

export interface TimelineEvent {
  id: string
  type: string
  effectiveDate: string
  oldValue?: string | null
  newValue?: string | null
}

export interface TimelineSection {
  events: TimelineEvent[]
}

export interface ProjectsSection {
  projects: Array<{ name: string }>
}

export type CustomFieldValueType =
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'multi_select'

export interface CustomFieldSpec {
  id: string
  name: string
  type: CustomFieldValueType
}

/** Mirrors the backend's `FieldValue` union (field-registry.contract.ts). */
export type CustomFieldValue = string | number | boolean | string[] | null

export interface CustomFieldsSection {
  /** Only fields that passed per-field visibility for this viewer/subject. */
  fields: CustomFieldSpec[]
  /** Stored values keyed by field id — a never-set field is omitted (AD-6). */
  values: Record<string, CustomFieldValue>
}

export interface ProfileSectionUnavailable {
  accessLevel: Exclude<SectionAccessLevel, 'none'>
  status: 'unavailable'
}

export interface ProfileSectionData<T> {
  accessLevel: Exclude<SectionAccessLevel, 'none'>
  data: T
}

export type ProfileSectionEnvelope<T> =
  | ProfileSectionUnavailable
  | ProfileSectionData<T>

export interface EmployeeProfile {
  employeeId: string
  displayName: string
  audience: {
    role: AccessRole
    sections: Record<SectionId, SectionAccessLevel>
  }
  sections: Partial<Record<SectionId, ProfileSectionEnvelope<unknown>>>
}
