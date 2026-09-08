import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { cn } from '@/lib/utils'
import {
  currentCalendarYear,
  quarterBoundsForYear,
  type PeriodRange,
  type Quarter,
} from '../utils/feedback-period'

interface PeriodRangePickerProps {
  periodId: 'a' | 'b'
  label: string
  period: PeriodRange
  onChange: (period: PeriodRange) => void
}

const QUARTERS: Quarter[] = [1, 2, 3, 4]

export const PeriodRangePicker = ({
  periodId,
  label,
  period,
  onChange,
}: PeriodRangePickerProps) => {
  const { t } = useTranslation()
  const year = currentCalendarYear()

  const startMissing = period.start.length === 0
  const endMissing = period.end.length === 0
  const rangeInvalid =
    !startMissing && !endMissing && period.start > period.end

  const validationMessage = rangeInvalid
    ? t('employeeProfile.s8.compare.validation.invalidRange')
    : startMissing || endMissing
      ? t('employeeProfile.s8.compare.validation.required')
      : null

  const applyQuarter = (quarter: Quarter) => {
    const bounds = quarterBoundsForYear(quarter, year)
    onChange(bounds)
  }

  return (
    <fieldset
      className="space-y-2 rounded-md border border-border p-3"
      data-testid={`feedback-period-${periodId}`}
    >
      <legend className="px-1 text-sm font-medium text-foreground">{label}</legend>

      <div className="flex flex-wrap gap-2">
        {QUARTERS.map(quarter => (
          <Button
            key={quarter}
            type="button"
            size="sm"
            variant="outline"
            onClick={() => applyQuarter(quarter)}
            data-testid={`feedback-period-${periodId}-q${quarter}`}
          >
            {t(`employeeProfile.s8.compare.quarters.q${quarter}`)}
          </Button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label
            className="mb-1 block text-xs text-muted-foreground"
            htmlFor={`feedback-period-${periodId}-start`}
          >
            {t('employeeProfile.s8.compare.startDate')}
          </label>
          <input
            id={`feedback-period-${periodId}-start`}
            type="date"
            value={period.start}
            onChange={event =>
              onChange({ ...period, start: event.target.value })
            }
            className={cn(
              'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm',
            )}
            data-testid={`feedback-period-${periodId}-start`}
          />
        </div>
        <div>
          <label
            className="mb-1 block text-xs text-muted-foreground"
            htmlFor={`feedback-period-${periodId}-end`}
          >
            {t('employeeProfile.s8.compare.endDate')}
          </label>
          <input
            id={`feedback-period-${periodId}-end`}
            type="date"
            value={period.end}
            onChange={event => onChange({ ...period, end: event.target.value })}
            className={cn(
              'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm',
            )}
            data-testid={`feedback-period-${periodId}-end`}
          />
        </div>
      </div>

      {validationMessage && (
        <p
          className="text-xs text-destructive"
          data-testid={`feedback-period-${periodId}-validation`}
        >
          {validationMessage}
        </p>
      )}
    </fieldset>
  )
}
