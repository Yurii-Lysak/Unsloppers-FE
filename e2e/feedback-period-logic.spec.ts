import { expect, test } from './shared/merged-fixtures'
import {
  currentCalendarYear,
  defaultComparePeriods,
  filterRecordsForPeriod,
  isDateInRange,
  isCompletePeriodRange,
  isValidPeriodRange,
  quarterBoundsForYear,
  sortRecordsChronologicalAsc,
} from '../src/pages/EmployeeProfilePage/components/FeedbackSection/utils/feedback-period'
import type { FeedbackRecordRead } from '../src/types/employee-profile'

const sampleRecord = (
  id: string,
  recordedAt: string,
  createdAt = '2026-01-01T00:00:00.000Z',
): FeedbackRecordRead => ({
  id,
  recordedAt,
  context: `Context ${id}`,
  body: `Body ${id}`,
  author: { id: 'author-1', displayName: 'Author' },
  createdAt,
  updatedAt: createdAt,
})

test.describe('feedback-period utils', () => {
  test('quarterBoundsForYear returns inclusive Q1 and Q3 ranges', () => {
    const year = currentCalendarYear()
    expect(quarterBoundsForYear(1, year)).toEqual({
      start: `${year}-01-01`,
      end: `${year}-03-31`,
    })
    expect(quarterBoundsForYear(3, year)).toEqual({
      start: `${year}-07-01`,
      end: `${year}-09-30`,
    })
  })

  test('defaultComparePeriods prefills Q1 and Q3', () => {
    const year = currentCalendarYear()
    const defaults = defaultComparePeriods(year)
    expect(defaults.periodA).toEqual(quarterBoundsForYear(1, year))
    expect(defaults.periodB).toEqual(quarterBoundsForYear(3, year))
  })

  test('isDateInRange is inclusive on both ends', () => {
    const period = { start: '2026-01-01', end: '2026-03-31' }
    expect(isDateInRange('2026-01-01', period)).toBe(true)
    expect(isDateInRange('2026-03-31', period)).toBe(true)
    expect(isDateInRange('2025-12-31', period)).toBe(false)
    expect(isDateInRange('2026-04-01', period)).toBe(false)
  })

  test('isCompletePeriodRange and isValidPeriodRange enforce completeness and order', () => {
    expect(isCompletePeriodRange({ start: '', end: '2026-01-01' })).toBe(false)
    expect(isValidPeriodRange({ start: '2026-02-01', end: '2026-01-01' })).toBe(
      false,
    )
    expect(isValidPeriodRange({ start: '2026-01-01', end: '2026-03-31' })).toBe(
      true,
    )
  })

  test('filterRecordsForPeriod returns only records in range', () => {
    const records = [
      sampleRecord('a', '2026-01-15'),
      sampleRecord('b', '2026-07-10'),
      sampleRecord('c', '2025-11-01'),
    ]
    const q1 = quarterBoundsForYear(1, 2026)
    expect(filterRecordsForPeriod(records, q1).map(r => r.id)).toEqual(['a'])
  })

  test('sortRecordsChronologicalAsc orders by recordedAt then createdAt then id', () => {
    const records = [
      sampleRecord('c', '2026-07-01', '2026-01-03T00:00:00.000Z'),
      sampleRecord('a', '2026-01-01', '2026-01-01T00:00:00.000Z'),
      sampleRecord('b', '2026-07-01', '2026-01-02T00:00:00.000Z'),
    ]
    expect(sortRecordsChronologicalAsc(records).map(r => r.id)).toEqual([
      'a',
      'b',
      'c',
    ])
  })

  test('overlapping ranges may include the same record twice when filtered separately', () => {
    const record = sampleRecord('overlap', '2026-06-15')
    const periodA = { start: '2026-01-01', end: '2026-06-30' }
    const periodB = { start: '2026-06-01', end: '2026-12-31' }
    expect(filterRecordsForPeriod([record], periodA)).toHaveLength(1)
    expect(filterRecordsForPeriod([record], periodB)).toHaveLength(1)
  })
})
