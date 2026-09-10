import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RiskBadge } from '@/components/RiskBadge/RiskBadge'
import { TrendArrow } from '@/components/TrendArrow/TrendArrow'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { DashboardTableRow, DashboardVariant } from '@/types/dashboard'
import type { RiskLevel } from '@/types/risk-dashboard'

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
  const navigate = useNavigate()
  const showDepartmentColumn = variant === 'pp'

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="dashboard-table-empty">
        {t('dashboard.table.empty')}
      </p>
    )
  }

  return (
    <Table data-testid="dashboard-scoped-table">
      <TableHeader>
        <TableRow>
          <TableHead>{t('dashboard.table.name')}</TableHead>
          <TableHead>{t('dashboard.table.risk')}</TableHead>
          <TableHead>{t('dashboard.table.leave')}</TableHead>
          {showDepartmentColumn ? (
            <TableHead>{t('dashboard.table.department')}</TableHead>
          ) : null}
          <TableHead>{t('dashboard.table.project')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(row => (
          <TableRow
            key={row.employeeId}
            className="h-11 cursor-pointer"
            onClick={() => navigate(`/employees/${row.employeeId}`)}
            data-testid={`dashboard-row-${row.employeeId}`}
          >
            <TableCell className="font-medium">{row.displayName}</TableCell>
            <TableCell>
              {row.risk && isRiskLevel(row.risk.level) ? (
                <div className="flex items-center gap-1.5">
                  <RiskBadge level={row.risk.level} />
                  <TrendArrow trend={row.risk.trend} level={row.risk.level} />
                </div>
              ) : (
                t('dashboard.table.emptyCell')
              )}
            </TableCell>
            <TableCell>
              {row.leaveStatus === 'available' ? (
                <span className={row.leaveStale ? 'text-muted-foreground italic' : undefined}>
                  {row.leaveLabel?.trim()
                    ? row.leaveLabel
                    : t('dashboard.table.emptyCell')}
                  {row.leaveStale ? ` (${t('dashboard.staleData')})` : ''}
                </span>
              ) : (
                t('dashboard.unavailable')
              )}
            </TableCell>
            {showDepartmentColumn ? (
              <TableCell>
                {row.departmentStatus === 'available' ? (
                  <span
                    className={
                      row.departmentStale ? 'text-muted-foreground italic' : undefined
                    }
                  >
                    {row.departmentLabel?.trim()
                      ? row.departmentLabel
                      : t('dashboard.table.emptyCell')}
                    {row.departmentStale ? ` (${t('dashboard.staleData')})` : ''}
                  </span>
                ) : (
                  t('dashboard.unavailable')
                )}
              </TableCell>
            ) : null}
            <TableCell>
              {row.projectStatus === 'available' ? (
                <span className={row.projectStale ? 'text-muted-foreground italic' : undefined}>
                  {row.projectLabel?.trim()
                    ? row.projectLabel
                    : t('dashboard.table.emptyCell')}
                  {row.projectStale ? ` (${t('dashboard.staleData')})` : ''}
                </span>
              ) : (
                t('dashboard.unavailable')
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
