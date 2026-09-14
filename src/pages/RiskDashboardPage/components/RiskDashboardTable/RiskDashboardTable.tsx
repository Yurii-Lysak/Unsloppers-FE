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
import type { RiskDashboardRow } from '@/types/risk-dashboard'
import { riskRowLinkLabel, riskRowProfilePath } from './risk-row-link'

interface RiskDashboardTableProps {
  rows: RiskDashboardRow[]
}

export const RiskDashboardTable = ({ rows }: RiskDashboardTableProps) => {
  const { t } = useTranslation()

  return (
    <Table data-testid="risk-dashboard-table">
      <TableHeader>
        <TableRow>
          <TableHead scope="col">{t('riskDashboard.table.name')}</TableHead>
          <TableHead scope="col">{t('riskDashboard.table.level')}</TableHead>
          <TableHead scope="col">{t('riskDashboard.table.recordedAt')}</TableHead>
          <TableHead scope="col">{t('riskDashboard.table.manager')}</TableHead>
          <TableHead scope="col">{t('riskDashboard.table.peoplePartner')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(row => (
          <TableRow
            key={row.employeeId}
            className="h-11"
            data-testid={`risk-dashboard-row-${row.employeeId}`}
          >
            <TableCell className="font-medium">
              <Link
                to={riskRowProfilePath(row.employeeId)}
                aria-label={riskRowLinkLabel(row.displayName, t)}
                className="font-medium text-primary hover:underline"
                data-testid={`risk-dashboard-link-${row.employeeId}`}
              >
                {row.displayName}
              </Link>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <RiskBadge level={row.currentLevel} />
                <TrendArrow trend={row.trend} level={row.currentLevel} />
              </div>
            </TableCell>
            <TableCell>{row.recordedAt}</TableCell>
            <TableCell>{row.managerName?.trim() ? row.managerName : null}</TableCell>
            <TableCell>
              {row.peoplePartnerName?.trim() ? row.peoplePartnerName : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
