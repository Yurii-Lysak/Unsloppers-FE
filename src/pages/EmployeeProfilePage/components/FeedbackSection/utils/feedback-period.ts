import type { FeedbackRecordRead } from '@/types/employee-profile'

export type PeriodRange = {
  start: string
  end: string
}

export type Quarter = 1 | 2 | 3 | 4

const pad = (value: number): string => String(value).padStart(2, '0')

export const formatCalendarDate = (year: number, month: number, day: number): string =>
  `${year}-${pad(month)}-${pad(day)}`

export const currentCalendarYear = (): number => new Date().getFullYear()

export const quarterBoundsForYear = (
  quarter: Quarter,
  year: number,
): PeriodRange => {
  switch (quarter) {
    case 1:
      return {
        start: formatCalendarDate(year, 1, 1),
        end: formatCalendarDate(year, 3, 31),
      }
    case 2:
      return {
        start: formatCalendarDate(year, 4, 1),
        end: formatCalendarDate(year, 6, 30),
      }
    case 3:
      return {
        start: formatCalendarDate(year, 7, 1),
        end: formatCalendarDate(year, 9, 30),
      }
    case 4:
      return {
        start: formatCalendarDate(year, 10, 1),
        end: formatCalendarDate(year, 12, 31),
      }
  }
}

export const defaultComparePeriods = (year = currentCalendarYear()): {
  periodA: PeriodRange
  periodB: PeriodRange
} => ({
  periodA: quarterBoundsForYear(1, year),
  periodB: quarterBoundsForYear(3, year),
})

export const isCompletePeriodRange = (period: PeriodRange): boolean =>
  period.start.length > 0 && period.end.length > 0

export const isValidPeriodRange = (period: PeriodRange): boolean => {
  if (!isCompletePeriodRange(period)) {
    return false
  }
  return period.start <= period.end
}

export const isDateInRange = (
  recordedAt: string,
  period: PeriodRange,
): boolean => recordedAt >= period.start && recordedAt <= period.end

export const filterRecordsForPeriod = (
  records: FeedbackRecordRead[],
  period: PeriodRange,
): FeedbackRecordRead[] =>
  records.filter(record => isDateInRange(record.recordedAt, period))

export const sortRecordsChronologicalAsc = (
  records: FeedbackRecordRead[],
): FeedbackRecordRead[] =>
  [...records].sort((left, right) => {
    if (left.recordedAt !== right.recordedAt) {
      return left.recordedAt.localeCompare(right.recordedAt)
    }
    if (left.createdAt !== right.createdAt) {
      return left.createdAt.localeCompare(right.createdAt)
    }
    return left.id.localeCompare(right.id)
  })

export const formatPeriodLabelDate = (isoDate: string, locale: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
