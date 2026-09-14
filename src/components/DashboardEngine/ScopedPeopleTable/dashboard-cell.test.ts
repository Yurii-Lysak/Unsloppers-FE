import { describe, expect, it } from 'vitest'
import { dashboardCellContent, dashboardRowsHaveStaleCells } from './dashboard-cell'

describe('dashboardCellContent', () => {
  it('returns the label for a granted cell', () => {
    expect(dashboardCellContent('available', 'On vacation')).toBe('On vacation')
  })

  it('renders a denied cell as absent, never a placeholder', () => {
    expect(dashboardCellContent('unavailable', 'On vacation')).toBeNull()
    expect(dashboardCellContent('unavailable')).toBeNull()
  })

  it('renders a blank label as absent', () => {
    expect(dashboardCellContent('available', '   ')).toBeNull()
    expect(dashboardCellContent('available')).toBeNull()
  })
})

describe('dashboardRowsHaveStaleCells', () => {
  it('is false when no row carries a stale flag', () => {
    expect(dashboardRowsHaveStaleCells([{ leaveStale: false }, {}])).toBe(false)
  })

  it('is true when any row carries any stale flag', () => {
    expect(
      dashboardRowsHaveStaleCells([{ leaveStale: false }, { projectStale: true }]),
    ).toBe(true)
  })
})
