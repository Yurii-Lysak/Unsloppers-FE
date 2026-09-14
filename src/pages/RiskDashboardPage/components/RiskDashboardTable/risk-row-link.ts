/**
 * Row-drill contract for the risk dashboard (EXPERIENCE.md Component Patterns):
 * the person name cell is a real link to the full Employee Profile. The row
 * itself is never interactive, so keyboard and screen-reader users drill via
 * the link, which announces the person's name.
 */
export const riskRowProfilePath = (employeeId: string): string =>
  `/employees/${employeeId}`

export const riskRowLinkLabel = (
  displayName: string,
  t: (key: string, options?: Record<string, string>) => string,
): string => t('riskDashboard.table.openProfile', { name: displayName })
