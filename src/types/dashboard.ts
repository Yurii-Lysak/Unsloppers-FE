export type DashboardVariant = 'um' | 'dm' | 'pm' | 'pp'

export type DashboardGrouping = 'people' | 'project'

export type DashboardBlockId = 'counters' | 'table' | 'ownActionItems' | 'quickNav'

export type DashboardVariantResolvedBy = 'seed-map' | 'functional-role'

export interface DashboardCounterSpec {
  id: string
  providerId: string
  labelKey: string
}

export interface DashboardConfigResponse {
  variant: DashboardVariant
  grouping: DashboardGrouping
  blocks: DashboardBlockId[]
  counters: DashboardCounterSpec[]
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
  projectStatus: 'available' | 'unavailable'
  projectLabel?: string
}

export interface DashboardProjectGroup {
  projectId: string
  projectName: string
  rows: DashboardTableRow[]
}

export interface DashboardSummaryResponse {
  variant: DashboardVariant
  grouping: DashboardGrouping
  counters: Record<string, DashboardCounterValue>
  rows?: DashboardTableRow[]
  groups?: DashboardProjectGroup[]
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
