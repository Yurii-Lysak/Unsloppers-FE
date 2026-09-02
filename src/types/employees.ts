export type FieldValueType =
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'multi_select'

export type FieldSource = 'builtin' | 'derived' | 'custom'

export type SortOrder = 'asc' | 'desc'

export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'contains'
  | 'in'

export type FieldValue = string | number | boolean | string[] | null

export interface FieldSpec {
  id: string
  name: string
  type: FieldValueType
  source: FieldSource
  sortable: boolean
  filterable: boolean
  visibility?: 'management' | 'employee' | 'colleague'
  options?: string[]
}

export interface EmployeeFieldFilter {
  fieldId: string
  operator: FilterOperator
  value: FieldValue | string[]
}

export interface EmployeeRow {
  employeeId: string
  cells: Record<string, FieldValue>
}

export interface EmployeeListResponse {
  fields: FieldSpec[]
  rows: EmployeeRow[]
  total: number
  page: number
  pageSize: number
}

export interface EmployeeListQuery {
  page?: number
  pageSize?: number
  sort?: string
  order?: SortOrder
  filters?: EmployeeFieldFilter[]
}

export interface EmployeeSummary {
  id: string
  displayName: string
}

export const BUILTIN_FIELD_IDS = {
  name: 'name',
  grade: 'grade',
  position: 'position',
  department: 'department',
  employment_type: 'employment_type',
  years_with_company: 'years_with_company',
} as const
