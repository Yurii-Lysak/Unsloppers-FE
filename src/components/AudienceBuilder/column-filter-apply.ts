import type { EmployeeFieldFilter, FilterOperator } from '@/types/employees'

export type ColumnFilterApplyInput = {
  fieldId: string
  operator: FilterOperator
  value: string
  selectedOptions: string[]
  betweenFrom: string
  betweenTo: string
  usesMultiOptionPicker: boolean
  usesOptionPicker: boolean
  fieldType: string
}

export const buildColumnFilterPayload = (
  input: ColumnFilterApplyInput,
): EmployeeFieldFilter | null => {
  const {
    fieldId,
    operator,
    value,
    selectedOptions,
    betweenFrom,
    betweenTo,
    usesMultiOptionPicker,
    usesOptionPicker,
    fieldType,
  } = input

  if (operator === 'is_empty') {
    return { fieldId, operator, value: null }
  }

  if (operator === 'between') {
    if (!betweenFrom || !betweenTo || betweenFrom > betweenTo) {
      return null
    }
    return { fieldId, operator, value: [betweenFrom, betweenTo] }
  }

  let parsedValue: EmployeeFieldFilter['value'] = value

  if (usesMultiOptionPicker) {
    if (selectedOptions.length === 0) {
      return null
    }
    parsedValue = selectedOptions
  } else if (usesOptionPicker) {
    if (!value) {
      return null
    }
    parsedValue = value
  } else if (fieldType === 'number') {
    parsedValue = Number(value)
    if (Number.isNaN(parsedValue)) {
      return null
    }
  } else if (fieldType === 'boolean') {
    parsedValue = value === 'true'
  } else if (!value) {
    return null
  }

  return { fieldId, operator, value: parsedValue }
}
