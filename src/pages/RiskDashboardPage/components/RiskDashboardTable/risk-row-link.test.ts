import { describe, expect, it } from 'vitest'
import { riskRowLinkLabel, riskRowProfilePath } from './risk-row-link'

const t = (key: string, options?: Record<string, string>) => `${key}:${options?.name ?? ''}`

describe('riskRowProfilePath', () => {
  it('drills to the full employee profile route', () => {
    expect(riskRowProfilePath('emp-high-1')).toBe('/employees/emp-high-1')
  })
})

describe('riskRowLinkLabel', () => {
  it('announces the person name on the drill link', () => {
    const label = riskRowLinkLabel('Olena Petrenko', t)
    expect(label).toContain('Olena Petrenko')
  })
})
