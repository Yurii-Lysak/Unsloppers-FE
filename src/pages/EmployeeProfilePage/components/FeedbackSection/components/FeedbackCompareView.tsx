import { useTranslation } from 'react-i18next'
import type { FeedbackRecordRead } from '@/types/employee-profile'
import {
  filterRecordsForPeriod,
  formatPeriodLabelDate,
  isValidPeriodRange,
  sortRecordsChronologicalAsc,
  type PeriodRange,
} from '../utils/feedback-period'
import { FeedbackCompareRecordCard } from './FeedbackCompareRecordCard'
import { PeriodRangePicker } from './PeriodRangePicker'

interface FeedbackCompareViewProps {
  records: FeedbackRecordRead[]
  periodA: PeriodRange
  periodB: PeriodRange
  onPeriodAChange: (period: PeriodRange) => void
  onPeriodBChange: (period: PeriodRange) => void
}

const CompareColumn = ({
  periodId,
  label,
  records,
}: {
  periodId: 'a' | 'b'
  label: string
  records: FeedbackRecordRead[]
}) => {
  const { t } = useTranslation()

  return (
    <section
      className="min-w-0 space-y-3"
      data-testid={`feedback-compare-column-${periodId}`}
      aria-label={label}
    >
      <h3 className="text-sm font-medium text-foreground">{label}</h3>
      {records.length === 0 ? (
        <p
          className="text-sm text-muted-foreground"
          data-testid={`feedback-compare-empty-${periodId}`}
        >
          {t('employeeProfile.s8.compare.emptyPeriod')}
        </p>
      ) : (
        <ul className="space-y-3">
          {records.map(record => (
            <li key={record.id}>
              <FeedbackCompareRecordCard record={record} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export const FeedbackCompareView = ({
  records,
  periodA,
  periodB,
  onPeriodAChange,
  onPeriodBChange,
}: FeedbackCompareViewProps) => {
  const { t, i18n } = useTranslation()
  const periodAValid = isValidPeriodRange(periodA)
  const periodBValid = isValidPeriodRange(periodB)
  const showColumns = periodAValid && periodBValid

  const formatLabel = (period: PeriodRange) =>
    t('employeeProfile.s8.compare.periodLabel', {
      start: formatPeriodLabelDate(period.start, i18n.language),
      end: formatPeriodLabelDate(period.end, i18n.language),
    })

  const periodARecords = showColumns
    ? sortRecordsChronologicalAsc(filterRecordsForPeriod(records, periodA))
    : []
  const periodBRecords = showColumns
    ? sortRecordsChronologicalAsc(filterRecordsForPeriod(records, periodB))
    : []

  return (
    <div className="space-y-4" data-testid="feedback-compare-view">
      <div className="grid gap-4 lg:grid-cols-2">
        <PeriodRangePicker
          periodId="a"
          label={t('employeeProfile.s8.compare.periodA')}
          period={periodA}
          onChange={onPeriodAChange}
        />
        <PeriodRangePicker
          periodId="b"
          label={t('employeeProfile.s8.compare.periodB')}
          period={periodB}
          onChange={onPeriodBChange}
        />
      </div>

      {showColumns && (
        <div className="grid gap-6 sm:grid-cols-2">
          <CompareColumn
            periodId="a"
            label={formatLabel(periodA)}
            records={periodARecords}
          />
          <CompareColumn
            periodId="b"
            label={formatLabel(periodB)}
            records={periodBRecords}
          />
        </div>
      )}
    </div>
  )
}
