/**
 * Absent-not-hidden cell contract (DESIGN.md access guardrail): a dashboard
 * cell the viewer has no grant for renders no content at all — never a `—`,
 * `unavailable`, lock, or placeholder. Staleness is communicated by the
 * table-level stale banner, never per cell.
 */
export const dashboardCellContent = (
  status: 'available' | 'unavailable',
  label?: string,
): string | null => {
  if (status !== 'available') {
    return null
  }
  const trimmed = label?.trim() ?? ''
  return trimmed.length > 0 ? trimmed : null
}

export const dashboardRowsHaveStaleCells = (
  rows: Array<{
    leaveStale?: boolean
    departmentStale?: boolean
    projectStale?: boolean
  }>,
): boolean => rows.some(row => row.leaveStale === true || row.departmentStale === true || row.projectStale === true)
