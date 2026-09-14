import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { RiskBadge } from '@/components/RiskBadge/RiskBadge'
import { TrendArrow } from '@/components/TrendArrow/TrendArrow'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Table/Table'
import type { DashboardTableRow, DashboardVariant } from '@/types/dashboard'
import type { RiskLevel } from '@/types/risk-dashboard'
import { dashboardCellContent, dashboardRowsHaveStaleCells } from './dashboard-cell'

interface ScopedPeopleTableProps {
  rows: DashboardTableRow[]
  variant?: DashboardVariant
}

const isRiskLevel = (value: string): value is RiskLevel =>
  value === 'low' ||
  value === 'need_attention' ||
  value === 'medium' ||
  value === 'high' ||
  value === 'leaver'

export const ScopedPeopleTable = ({ rows, variant }: ScopedPeopleTableProps) => {
  const { t } = useTranslation()
  const showDepartmentColumn = variant === 'pp'

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="dashboard-table-empty">
        {t('dashboard.table.empty')}
      </p>
    )
  }

  const showStaleBanner = dashboardRowsHaveStaleCells(rows)

  return (
    <div className="space-y-3">
      {showStaleBanner ? (
        <p
          className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
          role="status"
          data-testid="dashboard-stale-banner"
        >
          {t('dashboard.staleData')}
        </p>
      ) : null}
      <Table data-testid="dashboard-scoped-table">
        <TableHeader>
          <TableRow>
            <TableHead scope="col">{t('dashboard.table.name')}</TableHead>
            <TableHead scope="col">{t('dashboard.table.risk')}</TableHead>
            <TableHead scope="col">{t('dashboard.table.leave')}</TableHead>
            {showDepartmentColumn ? (
              <TableHead scope="col">{t('dashboard.table.department')}</TableHead>
            ) : null}
            <TableHead scope="col">{t('dashboard.table.project')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(row => (
            <TableRow
              key={row.employeeId}
              className="h-11"
              data-testid={`dashboard-row-${row.employeeId}`}
            >
              <TableCell className="font-medium">
                <Link
                  to={`/employees/${row.employeeId}`}
                  aria-label={t('dashboard.table.openProfile', { name: row.displayName })}
                  className="font-medium text-primary hover:underline"
                  data-testid={`dashboard-link-${row.employeeId}`}
                >
                  {row.displayName}
                </Link>
              </TableCell>
              <TableCell>
                {row.risk && isRiskLevel(row.risk.level) ? (
                  <div className="flex items-center gap-1.5">
                    <RiskBadge level={row.risk.level} />
                    <TrendArrow trend={row.risk.trend} level={row.risk.level} />
                  </div>
                ) : null}
              </TableCell>
              <TableCell>
                {dashboardCellContent(row.leaveStatus, row.leaveLabel)}
              </TableCell>
              {showDepartmentColumn ? (
                <TableCell>
                  {dashboardCellContent(row.departmentStatus ?? 'unavailable', row.departmentLabel)}
                </TableCell>
              ) : null}
              <TableCell>
                {dashboardCellContent(row.projectStatus, row.projectLabel)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
