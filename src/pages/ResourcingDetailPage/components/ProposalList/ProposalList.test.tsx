// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProposalList } from '@/pages/ResourcingDetailPage/components/ProposalList/ProposalList'
import { renderWithProviders } from '@/test-utils/test-render'
import type { ResourcingProposal } from '@/types/resourcing'

vi.mock('sonner', () => ({
  toast: { info: vi.fn(), success: vi.fn(), error: vi.fn() },
}))

import { toast } from 'sonner'

const proposal = (overrides?: Partial<ResourcingProposal>): ResourcingProposal => ({
  id: 'prop-1',
  requestId: 'req-1',
  proposedById: 'um-1',
  status: 'proposed',
  candidateEmployeeId: 'emp-1',
  candidateDisplayName: 'Ada Lovelace',
  sharedLinkToken: 'token-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

describe('ProposalList decision gates', () => {
  it('marks approve/reject as aria-disabled while deciding and announces the wait', async () => {
    const user = userEvent.setup()
    const onApprove = vi.fn()
    const onOpenReasonDialog = vi.fn()
    renderWithProviders(
      <ProposalList
        proposals={[proposal()]}
        isReviewingDm
        approvedCount={0}
        headcount={1}
        onApprove={onApprove}
        onOpenReasonDialog={onOpenReasonDialog}
        isDeciding
      />,
    )

    const approve = screen.getByTestId('resourcing-proposal-prop-1-approve')
    const reject = screen.getByTestId('resourcing-proposal-prop-1-reject')
    expect(approve.getAttribute('aria-disabled')).toBe('true')
    expect(reject.getAttribute('aria-disabled')).toBe('true')

    await user.click(approve)
    expect(onApprove).not.toHaveBeenCalled()
    expect(vi.mocked(toast.info)).toHaveBeenCalledWith('Saving…')

    await user.click(reject)
    expect(onOpenReasonDialog).not.toHaveBeenCalled()
    expect(vi.mocked(toast.info)).toHaveBeenCalledTimes(2)
  })

  it('guards approve against double-fire before deciding state flips', async () => {
    const user = userEvent.setup()
    const onApprove = vi.fn()
    renderWithProviders(
      <ProposalList
        proposals={[proposal()]}
        isReviewingDm
        approvedCount={0}
        headcount={1}
        onApprove={onApprove}
        onOpenReasonDialog={vi.fn()}
        isDeciding={false}
      />,
    )

    const approve = screen.getByTestId('resourcing-proposal-prop-1-approve')
    await user.click(approve)
    await user.click(approve)
    expect(onApprove).toHaveBeenCalledTimes(1)
  })

  it('announces why approval is blocked at full headcount', async () => {
    const user = userEvent.setup()
    const onApprove = vi.fn()
    renderWithProviders(
      <ProposalList
        proposals={[proposal()]}
        isReviewingDm
        approvedCount={1}
        headcount={1}
        onApprove={onApprove}
        onOpenReasonDialog={vi.fn()}
        isDeciding={false}
      />,
    )

    await user.click(screen.getByTestId('resourcing-proposal-prop-1-approve'))
    expect(onApprove).not.toHaveBeenCalled()
    expect(vi.mocked(toast.info)).toHaveBeenCalledWith(
      'Headcount is already fully approved. Reverse an approval to free a slot.',
    )
  })
})
