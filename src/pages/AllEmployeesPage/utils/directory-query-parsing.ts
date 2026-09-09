import type { EmployeeFieldFilter, FilterOperator } from '@/types/employees'

export const DIRECTORY_FILTER_OPERATORS: FilterOperator[] = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'contains',
  'in',
  'between',
  'is_empty',
]

export const isDirectoryFilterOperator = (
  value: unknown,
): value is FilterOperator =>
  typeof value === 'string' &&
  DIRECTORY_FILTER_OPERATORS.includes(value as FilterOperator)

export const isEmployeeFieldFilter = (value: unknown): value is EmployeeFieldFilter => {
  if (!value || typeof value !== 'object') {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.fieldId === 'string' &&
    isDirectoryFilterOperator(candidate.operator) &&
    (typeof candidate.value === 'string' ||
      typeof candidate.value === 'number' ||
      typeof candidate.value === 'boolean' ||
      candidate.value === null ||
      (Array.isArray(candidate.value) &&
        candidate.value.every(entry => typeof entry === 'string')))
  )
}

export const parseDirectoryFilters = (raw: string | null): EmployeeFieldFilter[] => {
  if (!raw) {
    return []
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isEmployeeFieldFilter)
  } catch {
    return []
  }
}
