import type { CampaignAudienceDefinition, CampaignAudiencePreview } from '@/types/campaigns'
import type {
  EmployeeFieldFilter,
  EmployeeListResponse,
  EmployeeRow,
  FieldSpec,
  FieldValue,
  FilterOperator,
} from '@/types/employees'

const normalizeText = (value: FieldValue | string[]): string => {
  if (Array.isArray(value)) {
    return value.join(',')
  }
  if (value === null || value === undefined) {
    return ''
  }
  return String(value)
}

const matchesTextFilter = (
  cellValue: FieldValue,
  operator: FilterOperator,
  rawFilterValue: FieldValue | string[],
): boolean => {
  const cellText = normalizeText(cellValue).toLowerCase()
  const filterText = normalizeText(rawFilterValue).toLowerCase()

  switch (operator) {
    case 'eq':
      return cellText === filterText
    case 'neq':
      return cellText !== filterText
    case 'contains':
      return cellText.includes(filterText)
    default:
      return false
  }
}

const matchesNumberFilter = (
  cellValue: FieldValue,
  operator: FilterOperator,
  rawFilterValue: FieldValue | string[],
): boolean => {
  if (typeof cellValue !== 'number' || Array.isArray(rawFilterValue)) {
    return false
  }
  const filterNumber =
    typeof rawFilterValue === 'number' ? rawFilterValue : Number(rawFilterValue)
  if (Number.isNaN(filterNumber)) {
    return false
  }

  switch (operator) {
    case 'eq':
      return cellValue === filterNumber
    case 'neq':
      return cellValue !== filterNumber
    case 'gt':
      return cellValue > filterNumber
    case 'gte':
      return cellValue >= filterNumber
    case 'lt':
      return cellValue < filterNumber
    case 'lte':
      return cellValue <= filterNumber
    default:
      return false
  }
}

const matchesBooleanFilter = (
  cellValue: FieldValue,
  operator: FilterOperator,
  rawFilterValue: FieldValue | string[],
): boolean => {
  if (typeof cellValue !== 'boolean' || Array.isArray(rawFilterValue)) {
    return false
  }
  const filterBoolean =
    typeof rawFilterValue === 'boolean' ? rawFilterValue : rawFilterValue === 'true'
  return operator === 'eq' ? cellValue === filterBoolean : cellValue !== filterBoolean
}

const matchesSelectFilter = (
  cellValue: FieldValue,
  operator: FilterOperator,
  rawFilterValue: FieldValue | string[],
): boolean => {
  if (operator === 'in') {
    if (!Array.isArray(rawFilterValue)) {
      return false
    }
    if (Array.isArray(cellValue)) {
      return rawFilterValue.some(entry => cellValue.includes(String(entry)))
    }
    const cellText = normalizeText(cellValue)
    return rawFilterValue.some(entry => entry === cellText)
  }
  return matchesTextFilter(cellValue, operator, rawFilterValue)
}

const matchesFilter = (
  cellValue: FieldValue,
  field: FieldSpec,
  filter: EmployeeFieldFilter,
): boolean => {
  switch (field.type) {
    case 'number':
      return matchesNumberFilter(cellValue, filter.operator, filter.value)
    case 'boolean':
      return matchesBooleanFilter(cellValue, filter.operator, filter.value)
    case 'select':
    case 'multi_select':
      return matchesSelectFilter(cellValue, filter.operator, filter.value)
    case 'text':
    case 'date':
      return matchesTextFilter(cellValue, filter.operator, filter.value)
    default:
      return false
  }
}

const rowMatchesFilters = (
  row: EmployeeRow,
  filters: EmployeeFieldFilter[],
  fieldById: Map<string, FieldSpec>,
): boolean =>
  filters.every(filter => {
    const field = fieldById.get(filter.fieldId)
    if (!field) {
      return false
    }
    return matchesFilter(row.cells[filter.fieldId] ?? null, field, filter)
  })

export const resolveAudienceEmployeeIds = (
  filterMatchIds: string[],
  definition: CampaignAudienceDefinition,
): string[] => {
  const excluded = new Set(definition.excludedEmployeeIds)
  const fromFilters = filterMatchIds.filter(id => !excluded.has(id))
  const resolved = new Set(fromFilters)
  for (const id of definition.addedEmployeeIds) {
    resolved.add(id)
  }
  return [...resolved]
}

const buildResolvedRows = (
  employeesList: EmployeeListResponse,
  definition: CampaignAudienceDefinition,
): EmployeeRow[] => {
  const fieldById = new Map(employeesList.fields.map(field => [field.id, field]))
  const filterMatchRows =
    definition.filters.length === 0
      ? []
      : employeesList.rows.filter(row => rowMatchesFilters(row, definition.filters, fieldById))
  const filterMatchIds = filterMatchRows.map(row => row.employeeId)
  const resolvedIds = resolveAudienceEmployeeIds(filterMatchIds, definition)
  const rowById = new Map(employeesList.rows.map(row => [row.employeeId, row]))
  return resolvedIds
    .map(id => rowById.get(id))
    .filter((row): row is EmployeeRow => row !== undefined)
}

export const resolveAudienceRows = buildResolvedRows

export const resolveAudiencePreview = (
  employeesList: EmployeeListResponse,
  definition: CampaignAudienceDefinition,
  page = 1,
  pageSize = 50,
): CampaignAudiencePreview => {
  const resolvedRows = buildResolvedRows(employeesList, definition)
  const start = (page - 1) * pageSize

  return {
    fields: employeesList.fields,
    rows: resolvedRows.slice(start, start + pageSize),
    total: resolvedRows.length,
    page,
    pageSize,
  }
}
