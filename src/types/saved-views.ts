import type { EmployeeFieldFilter, SortOrder } from '@/types/employees'

export interface SavedViewShareRecipient {
  employeeId: string
  name: string
}

export interface SavedView {
  id: string
  name: string
  filters: EmployeeFieldFilter[]
  columnIds: string[]
  sort?: string
  order?: SortOrder
  isOwner: boolean
  canEdit: boolean
  ownerEmployeeId?: string | null
  ownerName?: string | null
  sharedWith: SavedViewShareRecipient[]
}

export interface CreateSavedViewInput {
  name: string
  filters: EmployeeFieldFilter[]
  columnIds: string[]
  sort?: string
  order?: SortOrder
}

export interface UpdateSavedViewInput {
  name?: string
  filters?: EmployeeFieldFilter[]
  columnIds?: string[]
  sort?: string
  order?: SortOrder
}

export interface ShareSavedViewInput {
  recipientEmployeeIds: string[]
}
