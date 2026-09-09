export type DashboardVariant = 'um' | 'dm' | 'pm' | 'pp'

export type DashboardGrouping = 'people' | 'project'

export type DashboardBlockId = 'counters' | 'table' | 'ownActionItems' | 'quickNav'

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

export interface DashboardConfigResponse {
  variant: DashboardVariant
  grouping: DashboardGrouping
  blocks: DashboardBlockId[]
  counters: DashboardCounterSpec[]
  quickNav: DashboardQuickNavLink[]
  resolvedBy: DashboardVariantResolvedBy
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
