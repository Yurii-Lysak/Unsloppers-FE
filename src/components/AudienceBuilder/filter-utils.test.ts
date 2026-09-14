import { describe, expect, it } from 'vitest'
import { BUILTIN_FIELD_IDS } from '@/types/employees'
import { formatCellDisplay, formatCellValue } from './filter-utils'

const t = (key: string) => key

describe('formatCellDisplay', () => {
  it('returns unavailable label when field is in fieldsUnavailable', () => {
    expect(
      formatCellDisplay(null, BUILTIN_FIELD_IDS.last_assessment_date, [
        BUILTIN_FIELD_IDS.last_assessment_date,
      ], t),
    ).toBe('directory.cellUnavailable')
  })

  it('delegates to formatCellValue when field is available', () => {
    expect(
      formatCellDisplay('2026-03-15', BUILTIN_FIELD_IDS.last_assessment_date, [], t),
    ).toBe('2026-03-15')
  })
})

describe('formatCellValue', () => {
  it('renders null as absent content, never a placeholder', () => {
    expect(formatCellValue(null, t)).toBe('')
    expect(formatCellValue(undefined, t)).toBe('')
  })

  it('renders booleans with directory labels', () => {
    expect(formatCellValue(true, t)).toBe('directory.boolean.true')
    expect(formatCellValue(false, t)).toBe('directory.boolean.false')
  })
})
