import { describe, expect, it } from 'vitest'
import { BUILTIN_FIELD_IDS } from '@/types/employees'
import { buildColumnFilterPayload } from './column-filter-apply'

describe('buildColumnFilterPayload', () => {
  it('builds is_empty without a value', () => {
    expect(
      buildColumnFilterPayload({
        fieldId: BUILTIN_FIELD_IDS.last_assessment_date,
        operator: 'is_empty',
        value: '',
        selectedOptions: [],
        betweenFrom: '',
        betweenTo: '',
        usesMultiOptionPicker: false,
        usesOptionPicker: false,
        fieldType: 'date',
      }),
    ).toEqual({
      fieldId: BUILTIN_FIELD_IDS.last_assessment_date,
      operator: 'is_empty',
      value: null,
    })
  })

  it('builds between with a date tuple', () => {
    expect(
      buildColumnFilterPayload({
        fieldId: BUILTIN_FIELD_IDS.last_assessment_date,
        operator: 'between',
        value: '',
        selectedOptions: [],
        betweenFrom: '2026-01-01',
        betweenTo: '2026-06-30',
        usesMultiOptionPicker: false,
        usesOptionPicker: false,
        fieldType: 'date',
      }),
    ).toEqual({
      fieldId: BUILTIN_FIELD_IDS.last_assessment_date,
      operator: 'between',
      value: ['2026-01-01', '2026-06-30'],
    })
  })

  it('rejects between when from is after to', () => {
    expect(
      buildColumnFilterPayload({
        fieldId: BUILTIN_FIELD_IDS.last_assessment_date,
        operator: 'between',
        value: '',
        selectedOptions: [],
        betweenFrom: '2026-06-01',
        betweenTo: '2026-01-01',
        usesMultiOptionPicker: false,
        usesOptionPicker: false,
        fieldType: 'date',
      }),
    ).toBeNull()
  })

  it('builds has_open_idp boolean eq true', () => {
    expect(
      buildColumnFilterPayload({
        fieldId: BUILTIN_FIELD_IDS.has_open_idp,
        operator: 'eq',
        value: 'true',
        selectedOptions: [],
        betweenFrom: '',
        betweenTo: '',
        usesMultiOptionPicker: false,
        usesOptionPicker: false,
        fieldType: 'boolean',
      }),
    ).toEqual({
      fieldId: BUILTIN_FIELD_IDS.has_open_idp,
      operator: 'eq',
      value: true,
    })
  })
})
