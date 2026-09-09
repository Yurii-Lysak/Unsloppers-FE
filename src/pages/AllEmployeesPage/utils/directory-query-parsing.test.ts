import { describe, expect, it } from 'vitest'
import { BUILTIN_FIELD_IDS } from '@/types/employees'
import { parseDirectoryFilters } from './directory-query-parsing'

describe('parseDirectoryFilters', () => {
  it('parses between and is_empty operators from URL JSON', () => {
    const filters = parseDirectoryFilters(
      JSON.stringify([
        {
          fieldId: BUILTIN_FIELD_IDS.last_assessment_date,
          operator: 'is_empty',
          value: null,
        },
        {
          fieldId: BUILTIN_FIELD_IDS.last_assessment_date,
          operator: 'between',
          value: ['2026-01-01', '2026-06-30'],
        },
      ]),
    )

    expect(filters).toEqual([
      {
        fieldId: BUILTIN_FIELD_IDS.last_assessment_date,
        operator: 'is_empty',
        value: null,
      },
      {
        fieldId: BUILTIN_FIELD_IDS.last_assessment_date,
        operator: 'between',
        value: ['2026-01-01', '2026-06-30'],
      },
    ])
  })

  it('drops filters with unsupported operators', () => {
    const filters = parseDirectoryFilters(
      JSON.stringify([
        {
          fieldId: BUILTIN_FIELD_IDS.department,
          operator: 'contains',
          value: 'Sales',
        },
        {
          fieldId: BUILTIN_FIELD_IDS.last_assessment_date,
          operator: 'not_a_real_operator',
          value: null,
        },
      ]),
    )

    expect(filters).toEqual([
      {
        fieldId: BUILTIN_FIELD_IDS.department,
        operator: 'contains',
        value: 'Sales',
      },
    ])
  })
})
