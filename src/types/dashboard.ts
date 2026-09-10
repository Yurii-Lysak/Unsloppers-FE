export const DASHBOARD_UNASSIGNED_PROJECT_ID = 'unassigned'
export const DASHBOARD_ALL_PROJECTS_VALUE = 'all'

export type DashboardVariant = 'um' | 'dm' | 'pm' | 'pp'

export type DashboardGrouping = 'people' | 'project'

export type DashboardBlockId =
  | 'counters'
  | 'table'
  | 'ownActionItems'
  | 'quickNav'
  | 'resourcingRequests'
  | 'idpDeadlines'

export type DashboardVariantResolvedBy = 'seed-map' | 'functional-role'

export interface DashboardCounterSpec {
  id: string
  providerId: string
  labelKey: string
}

export interface DashboardQuickNavLink {
  labelKey: string
  path: string
}

export interface DashboardSelectorProject {
  projectId: string
  projectName: string
}

export interface DashboardResourcingRequestRow {
  id: string
  vacancyDetails: string
  status: 'open' | 'pending_dm_review'
  projectId?: string | null
  authorDisplayName: string
  createdAt: string
}

export interface DashboardIdpRow {
  id: string
  employeeId: string
  employeeDisplayName: string
  description: string
  deadline: string
}

export interface DashboardConfigResponse {
  variant: DashboardVariant
  grouping: DashboardGrouping
  blocks: DashboardBlockId[]
  counters: DashboardCounterSpec[]
  quickNav: DashboardQuickNavLink[]
  resolvedBy: DashboardVariantResolvedBy
  selectorProjects?: DashboardSelectorProject[]
}

export interface DashboardCounterValue {
  status: 'available' | 'unavailable'
  value?: number
}

export interface DashboardTableRiskCell {
  level: string
  trend?: 'up' | 'down' | 'flat'
  recordedAt: string
}

export interface DashboardTableRow {
  employeeId: string
  displayName: string
  risk?: DashboardTableRiskCell
  leaveStatus: 'available' | 'unavailable'
  leaveLabel?: string
  leaveStale?: boolean
  projectStatus: 'available' | 'unavailable'
  projectLabel?: string
  projectStale?: boolean
  departmentStatus?: 'available' | 'unavailable'
  departmentLabel?: string
  departmentStale?: boolean
}

export interface DashboardProjectGroup {
  projectId: string
  projectName: string
  rows: DashboardTableRow[]
}

export interface DashboardPagination {
  page: number
  pageSize: number
  totalRows: number
}

export interface DashboardSummaryResponse {
  variant: DashboardVariant
  grouping: DashboardGrouping
  counters: Record<string, DashboardCounterValue>
  rows?: DashboardTableRow[]
  groups?: DashboardProjectGroup[]
  pagination?: DashboardPagination
  selectorProjects?: DashboardSelectorProject[]
  resourcingRequests?: DashboardResourcingRequestRow[]
  idpDeadlines?: DashboardIdpRow[]
}

export interface AuthoredActionItem {
  id: string
  title: string
  description?: string
  dueDate: string
  status: 'open' | 'completed' | 'cancelled'
  isOverdue: boolean
  assignee: {
    id: string
    displayName: string
  }
}
