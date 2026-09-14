// @vitest-environment jsdom
import { cleanup, render, type RenderOptions } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { afterEach } from 'vitest'
import type { ReactElement } from 'react'
import i18n from '@/i18n/config'
import { TooltipProvider } from '@/components/Tooltip/Tooltip'

afterEach(() => {
  cleanup()
})

export const renderWithProviders = (ui: ReactElement, options?: RenderOptions) =>
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <TooltipProvider>{ui}</TooltipProvider>
      </MemoryRouter>
    </I18nextProvider>,
    options,
  )
