// @vitest-environment jsdom
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmationModal } from '@/components/ConfirmationModal/ConfirmationModal'
import { renderWithProviders } from '@/test-utils/test-render'

const baseProps = {
  title: 'Activate this campaign?',
  description: 'Activation freezes the audience.',
  confirmLabel: 'Activate campaign',
  cancelLabel: 'Cancel',
  onConfirm: vi.fn(),
  onOpenChange: vi.fn(),
}

describe('ConfirmationModal reason gate', () => {
  it('links the announced hint to the gated action and falls back to generic wording', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <ConfirmationModal {...baseProps} open confirmDisabled onConfirm={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: 'Activate campaign' }))

    const hint = screen.getByRole('status')
    expect(hint.textContent).toContain('This action is currently unavailable.')
    const describedBy = screen
      .getByRole('button', { name: 'Activate campaign' })
      .getAttribute('aria-describedby')
    expect(describedBy).toBe(hint.getAttribute('id'))
  })

  it('prefers the caller-provided hint when given', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <ConfirmationModal
        {...baseProps}
        open
        confirmDisabled
        confirmDisabledHint="Add a written reason to reject."
        onConfirm={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Activate campaign' }))
    expect(screen.getByRole('status').textContent).toContain(
      'Add a written reason to reject.',
    )
  })

  it('resets the announced hint when the dialog reopens', async () => {
    const user = userEvent.setup()
    const { rerender } = renderWithProviders(
      <ConfirmationModal {...baseProps} open confirmDisabled onConfirm={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: 'Activate campaign' }))
    expect(screen.getByRole('status')).not.toBeNull()

    rerender(
      <ConfirmationModal {...baseProps} open={false} confirmDisabled onConfirm={vi.fn()} />,
    )
    rerender(
      <ConfirmationModal {...baseProps} open confirmDisabled onConfirm={vi.fn()} />,
    )
    expect(screen.queryByRole('status')).toBeNull()
  })
})
