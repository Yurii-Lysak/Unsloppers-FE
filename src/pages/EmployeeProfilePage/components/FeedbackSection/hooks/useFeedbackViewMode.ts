import { useCallback, useEffect, useState } from 'react'
import {
  defaultComparePeriods,
  type PeriodRange,
} from '../utils/feedback-period'

export type FeedbackViewMode = 'list' | 'compare'

const emptyPeriod = (): PeriodRange => ({ start: '', end: '' })

export const useFeedbackViewMode = (employeeId: string) => {
  const [viewMode, setViewMode] = useState<FeedbackViewMode>('list')
  const [periodA, setPeriodA] = useState<PeriodRange>(emptyPeriod)
  const [periodB, setPeriodB] = useState<PeriodRange>(emptyPeriod)
  const [compareInitialized, setCompareInitialized] = useState(false)

  useEffect(() => {
    setViewMode('list')
    setPeriodA(emptyPeriod())
    setPeriodB(emptyPeriod())
    setCompareInitialized(false)
  }, [employeeId])

  const enterCompareMode = useCallback(() => {
    if (!compareInitialized) {
      const defaults = defaultComparePeriods()
      setPeriodA(defaults.periodA)
      setPeriodB(defaults.periodB)
      setCompareInitialized(true)
    }
    setViewMode('compare')
  }, [compareInitialized])

  const enterListMode = useCallback(() => {
    setViewMode('list')
  }, [])

  return {
    viewMode,
    periodA,
    periodB,
    setPeriodA,
    setPeriodB,
    enterCompareMode,
    enterListMode,
  }
}
