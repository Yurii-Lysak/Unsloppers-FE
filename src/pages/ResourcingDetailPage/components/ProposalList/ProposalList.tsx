import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import type { ResourcingProposal } from '@/types/resourcing'

interface ProposalListProps {
  proposals: ResourcingProposal[]
  isReviewingDm: boolean
  approvedCount: number
  headcount: number
  onApprove: (proposalId: string) => void
  onOpenReasonDialog: (proposalId: string) => void
  isDeciding: boolean
}

export const ProposalList = ({
  proposals,
  isReviewingDm,
  approvedCount,
  headcount,
  onApprove,
  onOpenReasonDialog,
  isDeciding,
}: ProposalListProps) => {
  const { t } = useTranslation()
  const headcountFull = approvedCount >= headcount

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
          className="space-y-2 p-4"
          data-testid={`resourcing-proposal-${proposal.id}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {proposal.candidateEmployeeId ? (
              <div>
                <p className="font-medium text-foreground">{proposal.candidateDisplayName}</p>
                <p className="text-sm text-muted-foreground">
                  {t('resourcing.detail.proposals.internal')}
                </p>
                {isReviewingDm &&
                  (proposal.sharedLinkToken ? (
                    <Link
                      to={`/shared-links/${proposal.sharedLinkToken}`}
                      className="text-sm font-medium text-primary hover:underline"
                      data-testid={`resourcing-proposal-${proposal.id}-profile-link`}
                    >
                      {t('resourcing.detail.proposals.reviewProfile')}
                    </Link>
                  ) : (
                    <p
                      className="text-sm text-muted-foreground"
                      data-testid={`resourcing-proposal-${proposal.id}-profile-unavailable`}
                    >
                      {t('resourcing.detail.proposals.profileLinkUnavailable')}
                    </p>
                  ))}
              </div>
            ) : (
              <div>
                {proposal.peopleForceCandidateUrl ? (
                  <a
                    href={proposal.peopleForceCandidateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {t('resourcing.detail.proposals.viewInPeopleForce')}
                  </a>
                ) : (
                  <p className="font-medium text-muted-foreground">
                    {t('resourcing.detail.proposals.externalLinkUnavailable')}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {t('resourcing.detail.proposals.external')}
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {t(`resourcing.detail.proposals.status.${proposal.status}`)}
              </span>
              {isReviewingDm && proposal.status === 'proposed' && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onApprove(proposal.id)}
                    disabled={isDeciding || headcountFull}
                    data-testid={`resourcing-proposal-${proposal.id}-approve`}
                  >
                    {t('resourcing.detail.decide.approve')}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenReasonDialog(proposal.id)}
                    disabled={isDeciding}
                    data-testid={`resourcing-proposal-${proposal.id}-reject`}
                  >
                    {t('resourcing.detail.decide.reject.action')}
                  </Button>
                </>
              )}
              {isReviewingDm && proposal.status === 'approved' && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenReasonDialog(proposal.id)}
                  disabled={isDeciding}
                  data-testid={`resourcing-proposal-${proposal.id}-reverse`}
                >
                  {t('resourcing.detail.decide.reverse.action')}
                </Button>
              )}
            </div>
          </div>

          {proposal.decidedAt ? (
            <p className="text-sm text-muted-foreground">
              {t('resourcing.detail.decide.decidedAt', {
                date: new Date(proposal.decidedAt).toLocaleDateString(),
              })}
            </p>
          ) : null}

          {proposal.status === 'rejected' && proposal.decisionReason && (
            <p
              className="text-sm text-muted-foreground"
              data-testid={`resourcing-proposal-${proposal.id}-reason`}
            >
              {t('resourcing.detail.decide.reasonShown', { reason: proposal.decisionReason })}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
