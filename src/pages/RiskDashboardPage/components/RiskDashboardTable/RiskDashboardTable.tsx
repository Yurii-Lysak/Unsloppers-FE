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
import type { RiskDashboardRow } from '@/types/risk-dashboard'

interface RiskDashboardTableProps {
  rows: RiskDashboardRow[]
}

export const RiskDashboardTable = ({ rows }: RiskDashboardTableProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Table data-testid="risk-dashboard-table">
      <TableHeader>
        <TableRow>
          <TableHead>{t('riskDashboard.table.name')}</TableHead>
          <TableHead>{t('riskDashboard.table.level')}</TableHead>
          <TableHead>{t('riskDashboard.table.recordedAt')}</TableHead>
          <TableHead>{t('riskDashboard.table.manager')}</TableHead>
          <TableHead>{t('riskDashboard.table.peoplePartner')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(row => (
          <TableRow
            key={row.employeeId}
            className="h-11 cursor-pointer"
            onClick={() => navigate(`/employees/${row.employeeId}`)}
            data-testid={`risk-dashboard-row-${row.employeeId}`}
          >
            <TableCell className="font-medium">{row.displayName}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <RiskBadge level={row.currentLevel} />
                <TrendArrow trend={row.trend} level={row.currentLevel} />
              </div>
            </TableCell>
            <TableCell>{row.recordedAt}</TableCell>
            <TableCell>{row.managerName ?? t('riskDashboard.table.emptyCell')}</TableCell>
            <TableCell>
              {row.peoplePartnerName ?? t('riskDashboard.table.emptyCell')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
