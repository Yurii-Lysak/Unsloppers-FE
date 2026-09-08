import { useTranslation } from 'react-i18next'
import type { ResourcingProposal } from '@/types/resourcing'

interface ProposalListProps {
  proposals: ResourcingProposal[]
}

export const ProposalList = ({ proposals }: ProposalListProps) => {
  const { t } = useTranslation()

  if (proposals.length === 0) {
    return (
      <p className="text-muted-foreground" data-testid="resourcing-proposals-empty">
        {t('resourcing.detail.proposals.empty')}
      </p>
    )
  }

  return (
    <ul
      className="divide-y divide-border rounded-lg border border-border"
      data-testid="resourcing-proposals-list"
    >
      {proposals.map(proposal => (
        <li
          key={proposal.id}
          className="flex items-center justify-between gap-4 p-4"
          data-testid={`resourcing-proposal-${proposal.id}`}
        >
          {proposal.candidateEmployeeId ? (
            <div>
              <p className="font-medium text-foreground">{proposal.candidateDisplayName}</p>
              <p className="text-sm text-muted-foreground">
                {t('resourcing.detail.proposals.internal')}
              </p>
            </div>
          ) : (
            <div>
              <a
                href={proposal.peopleForceCandidateUrl ?? '#'}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {t('resourcing.detail.proposals.viewInPeopleForce')}
              </a>
              <p className="text-sm text-muted-foreground">
                {t('resourcing.detail.proposals.external')}
              </p>
            </div>
          )}
          <span className="text-sm text-muted-foreground">
            {t(`resourcing.detail.proposals.status.${proposal.status}`)}
          </span>
        </li>
      ))}
    </ul>
  )
}
