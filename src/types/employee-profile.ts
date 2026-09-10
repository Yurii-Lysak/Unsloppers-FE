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

export type RiskLevel =
  | 'low'
  | 'need_attention'
  | 'medium'
  | 'high'
  | 'leaver'

export interface RiskRecordAuthor {
  id: string
  displayName: string
}

export interface RiskRecord {
  id: string
  level: RiskLevel
  description: string
  details: string
  recordedAt: string
  author: RiskRecordAuthor
  createdAt: string
}

export interface RisksSection {
  records: RiskRecord[]
  currentLevel?: RiskLevel
  trend?: 'up' | 'down' | 'flat'
}

export type RequestHistoryStatus = 'proposed' | 'approved' | 'rejected'

export interface RequestHistoryEntry {
  id: string
  requestId: string
  status: RequestHistoryStatus
  decisionReason?: string | null
  proposedAt: string
  decidedAt?: string | null
  vacancyDetails: string
  department: string
  requestStatus?: 'open' | 'pending_dm_review'
  projectName?: string | null
}

export interface RequestHistorySection {
  entries: RequestHistoryEntry[]
}

export interface CdsAssessmentEntry {
  id: string
  date: string
  assessor: string
  resultLink: string
  conclusion: string
  createdAt: string
}

export interface IdpRecord {
  id: string
  description: string
  deadline: string
  fileUrl: string
  completedAt: string | null
}

export interface CdsSection {
  matrixLink: string | null
  assessments: CdsAssessmentEntry[]
  idpRecords: IdpRecord[]
}

export interface CreateIdpRecordPayload {
  description: string
  deadline: string
  fileUrl: string
}

export interface UpdateIdpRecordPayload {
  description?: string
  deadline?: string
  fileUrl?: string
}

export interface CreateCdsAssessmentPayload {
  date: string
  assessor: string
  resultLink: string
  conclusion: string
}

export interface UpdateCdsAssessmentConclusionPayload {
  conclusion: string
}

export interface CreateRiskRecordPayload {
  level: RiskLevel
  description: string
  details: string
  recordedAt: string
}

export interface CreateManagementNotePayload {
  content: string
  visibleForEmployee?: boolean
  visibleForPm?: boolean
}

export interface UpdateManagementNotePayload {
  content?: string
  visibleForEmployee?: boolean
  visibleForPm?: boolean
}

export interface FeedbackRecordAuthor {
  id: string
  displayName: string
}

export interface FeedbackRecordRead {
  id: string
  recordedAt: string
  context: string
  body: string
  author: FeedbackRecordAuthor
  createdAt: string
  updatedAt: string
}

export interface FeedbackRecord extends FeedbackRecordRead {
  sharedWithEmployee: boolean
}

export interface FeedbackSection {
  records: FeedbackRecordRead[] | FeedbackRecord[]
}

export interface CreateFeedbackRecordPayload {
  recordedAt: string
  context: string
  body: string
  sharedWithEmployee?: boolean
}

export interface UpdateFeedbackRecordPayload {
  recordedAt?: string
  context?: string
  body?: string
  sharedWithEmployee?: boolean
}

export interface IdentityRelation {
  id: string
  displayName: string
  pairId?: string
}

export interface IdentitySection {
  displayName: string
  photoUrl?: string | null
  manager?: IdentityRelation | null
  peoplePartner?: IdentityRelation | null
  mentor?: IdentityRelation
}

export type DocumentType =
  | 'CONTRACT'
  | 'W8'
  | 'COOPERATION_FORM'
  | 'DIIA_CITY'
  | 'CV'
  | 'CERTIFICATE'

export interface DocumentRecord {
  id: string
  type: DocumentType
  originalFilename: string
  uploadedAt: string
  downloadUrl: string
}

export interface DocumentsSection {
  documents: DocumentRecord[]
}

export type MentorStatus = 'mentor' | 'openToMentoring' | 'none'

export interface MentorshipSection {
  openToMentoring: boolean
  mentorStatus: MentorStatus
  mentor?: IdentityRelation | null
  mentees: IdentityRelation[]
  pairHistory: MentorshipPairHistory[]
}

export interface MentorshipPairHistory {
  id: string
  role: 'mentor' | 'mentee'
  counterpart: IdentityRelation
  startedAt: string
  endedAt: string
  closureFeedback?: string | null
}

export interface PatchOpenToMentoringPayload {
  openToMentoring: boolean
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

export interface EmploymentSection {
  grade: string | null
  position: string | null
  seniority: string | null
  employmentType: string | null
  englishLevel: string | null
  probationStatus: string | null
  contractType: string | null
}

export type PersonalContactMethodType = 'PHONE' | 'EMAIL' | 'MESSENGER'

export interface PersonalContactMethod {
  id: string
  type: PersonalContactMethodType
  label: string
  value: string
  createdAt: string
  updatedAt: string
}

export interface PersonalContactsSection {
  contactMethods: PersonalContactMethod[]
  residentialAddress: string | null
  placeOfStay: string | null
}

export interface EmergencyContact {
  id: string
  contactPerson: string
  relationship: string
  phone: string
  createdAt: string
  updatedAt: string
}

export interface EmergencyContactsSection {
  contacts: EmergencyContact[]
}

export interface CreateContactMethodPayload {
  type: PersonalContactMethodType
  label: string
  value: string
}

export interface UpdateContactMethodPayload {
  type?: PersonalContactMethodType
  label?: string
  value?: string
}

export interface PatchAddressPayload {
  residentialAddress?: string | null
  placeOfStay?: string | null
}

export interface CreateEmergencyContactPayload {
  contactPerson: string
  relationship: string
  phone: string
}

export interface UpdateEmergencyContactPayload {
  contactPerson?: string
  relationship?: string
  phone?: string
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
