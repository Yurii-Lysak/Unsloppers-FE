import type { FilterOperator } from '@/types/employees'

export const defaultFilterOperatorForType = (type: string): FilterOperator => {
  if (type === 'number') {
    return 'eq'
  }
  if (type === 'boolean') {
    return 'eq'
  }
  if (type === 'multi_select') {
    return 'in'
  }
  if (type === 'select') {
    return 'eq'
  }
  return 'contains'
}

export const formatFieldOptionLabel = (
  fieldId: string,
  option: string,
  t: (key: string) => string,
): string => {
  const key = `directory.fields.${fieldId}.${option}`
  const translated = t(key)
  return translated === key ? option : translated
}

export const formatCellValue = (
  value: unknown,
  t: (key: string) => string,
  fieldId?: string,
): string => {
  if (value === null || value === undefined) {
    return t('directory.cellEmpty')
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'boolean') {
    return value ? t('directory.boolean.true') : t('directory.boolean.false')
  }
  if (fieldId && typeof value === 'string') {
    return formatFieldOptionLabel(fieldId, value, t)
  }
  return String(value)
}
