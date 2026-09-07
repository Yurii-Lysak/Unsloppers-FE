import { useTranslation } from 'react-i18next'
import { CancelledBadge } from '@/components/CancelledBadge/CancelledBadge'
import { OverdueIndicator } from '@/components/OverdueIndicator/OverdueIndicator'
import { StatusBadge } from '@/components/StatusBadge/StatusBadge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CampaignCompletion } from '@/types/campaigns'

interface CampaignCompletionTableProps {
  completion: CampaignCompletion
}

export const CampaignCompletionTable = ({ completion }: CampaignCompletionTableProps) => {
  const { t } = useTranslation()

  if (completion.recipients.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" data-testid="campaign-completion-empty">
        {t('campaigns.completion.empty')}
      </p>
    )
  }

  return (
    <Table data-testid="campaign-completion-table">
      <TableHeader>
        <TableRow>
          <TableHead>{t('campaigns.completion.assignee')}</TableHead>
          <TableHead>{t('campaigns.completion.status')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {completion.recipients.map(row => (
          <TableRow
            key={row.actionItemId}
            data-testid={`campaign-completion-row-${row.assignee.id}`}
          >
            <TableCell>{row.assignee.displayName}</TableCell>
            <TableCell>
              {row.status === 'completed' && <StatusBadge />}
              {row.status === 'cancelled' && <CancelledBadge />}
              {row.status === 'open' && row.isOverdue && (
                <OverdueIndicator dueDate={row.dueDate} />
              )}
              {row.status === 'open' && !row.isOverdue && (
                <span className="text-sm text-muted-foreground">
                  {t('campaigns.completion.open')}
                </span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
