// @vitest-environment jsdom
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SharedLinkManagerDialog } from '@/pages/EmployeeProfilePage/components/SharedLinkManagerDialog/SharedLinkManagerDialog'
import { renderWithProviders } from '@/test-utils/test-render'

vi.mock('sonner', () => ({
  toast: { info: vi.fn(), success: vi.fn(), error: vi.fn() },
}))

import { toast } from 'sonner'

const link = (id: string) => ({
  id,
  recipient: { id: `recipient-${id}`, displayName: `Recipient ${id}` },
  expiresAt: '2026-09-14T00:00:00.000Z',
  sectionIds: ['S1'],
})

const state = vi.hoisted(() => ({
  links: [
    {
      id: 'link-1',
      recipient: { id: 'recipient-link-1', displayName: 'Recipient link-1' },
      expiresAt: '2026-09-14T00:00:00.000Z',
      sectionIds: ['S1'],
    },
  ],
  revokeImpl: null as null | ((linkId: string) => Promise<unknown>),
}))

vi.mock('@/api/hooks/useSharedLinks', () => ({
  useCreateSharedLink: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useRevokeSharedLink: () => ({
    mutateAsync: (linkId: string) => state.revokeImpl?.(linkId),
    isPending: false,
  }),
  useSharedLinksList: () => ({
    data: { links: state.links },
    isLoading: false,
    isError: false,
    refetch: vi.fn(async () => {
      state.links = []
    }),
  }),
  useSharedLinkAccessLog: () => ({
    data: { entries: [] },
    isLoading: false,
    isError: false,
  }),
}))

vi.mock('@/api/hooks/useEmployeeList', () => ({
  useEmployeeList: () => ({ data: { rows: [] }, isLoading: false }),
}))

const openDialog = () => {
  state.links = [link('link-1')]
  state.revokeImpl = async () => ({ ok: true })
  return renderWithProviders(
    <SharedLinkManagerDialog
      employeeId="emp-1"
      open
      onClose={vi.fn()}
      canCreate={false}
      canManage
    />,
  )
}

describe('SharedLinkManagerDialog revoke confirm', () => {
  it('requires an explicit confirm before revoking', async () => {
    const user = userEvent.setup()
    openDialog()

    expect(screen.getByTestId('shared-link-row-link-1')).not.toBeNull()
    expect(screen.queryByTestId('shared-link-revoke-confirm-link-1')).toBeNull()

    await user.click(screen.getByTestId('shared-link-revoke-link-1'))
    expect(screen.getByTestId('shared-link-revoke-confirm-link-1')).not.toBeNull()
  })

  it('cancels the confirm and returns focus to the revoke button', async () => {
    const user = userEvent.setup()
    openDialog()

    await user.click(screen.getByTestId('shared-link-revoke-link-1'))
    await user.click(screen.getByTestId('shared-link-revoke-cancel-link-1'))

    expect(screen.queryByTestId('shared-link-revoke-confirm-link-1')).toBeNull()
    await waitFor(() => {
      expect(document.activeElement?.getAttribute('data-testid')).toBe(
        'shared-link-revoke-link-1',
      )
    })
  })

  it('revokes on confirm, announces success, and moves focus into the manage panel', async () => {
    const user = userEvent.setup()
    openDialog()

    await user.click(screen.getByTestId('shared-link-revoke-link-1'))
    await user.click(screen.getByTestId('shared-link-revoke-confirm-button-link-1'))

    await waitFor(() => {
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith('Shared link revoked.')
    })
    expect(screen.queryByTestId('shared-link-row-link-1')).toBeNull()
    await waitFor(() => {
      expect(document.activeElement?.getAttribute('data-testid')).toBe(
        'shared-link-manage-panel',
      )
    })
  })

  it('retains the link with a retry path when revoke fails', async () => {
    const user = userEvent.setup()
    openDialog()
    state.revokeImpl = async () => {
      throw new Error('revoke failed')
    }

    await user.click(screen.getByTestId('shared-link-revoke-link-1'))
    await user.click(screen.getByTestId('shared-link-revoke-confirm-button-link-1'))

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
        'Could not revoke the shared link. Try again.',
      )
    })
    // The row and its armed confirm stay so the author can retry.
    expect(screen.getByTestId('shared-link-row-link-1')).not.toBeNull()
    expect(screen.getByTestId('shared-link-revoke-confirm-link-1')).not.toBeNull()
  })
})
