import { expect, test } from './shared/merged-fixtures'
import {
  buildRequestFeedbackDefaultValues,
  createRequestFeedbackFormSchema,
} from '../src/pages/EmployeeProfilePage/components/FeedbackSection/schemas/request-feedback.schema'

const t = (key: string, options?: { name?: string }) => {
  if (options?.name) {
    return `${key}:${options.name}`
  }
  return key
}

const validCampaignFields = {
  title: 'Feedback request: Subject',
  description: 'Request feedback about Subject from selected colleagues.',
  purpose: 'Collect feedback about Subject via the linked external form.',
  link: 'https://forms.example.com/feedback',
  dueDate: '2026-12-31',
}

test.describe('request-feedback schema', () => {
  test('requires at least one colleague', () => {
    const { schema } = createRequestFeedbackFormSchema(t)

    const result = schema.safeParse({
      ...validCampaignFields,
      colleagueIds: [],
    })

    expect(result.success).toBe(false)
  })

  test('accepts valid metadata and colleague ids', () => {
    const { schema } = createRequestFeedbackFormSchema(t)

    const result = schema.safeParse({
      ...validCampaignFields,
      colleagueIds: [
        '22222222-2222-4222-8222-222222222201',
        '33333333-3333-4333-8333-333333333301',
      ],
    })

    expect(result.success).toBe(true)
  })

  test('rejects invalid campaign link like the campaign schema', () => {
    const { schema } = createRequestFeedbackFormSchema(t)

    const result = schema.safeParse({
      ...validCampaignFields,
      link: 'not-a-url',
      colleagueIds: ['22222222-2222-4222-8222-222222222201'],
    })

    expect(result.success).toBe(false)
  })

  test('buildRequestFeedbackDefaultValues pre-fills subject copy and empty link/dueDate', () => {
    const defaults = buildRequestFeedbackDefaultValues(t, 'Anton Savchenko')

    expect(defaults.title).toContain('Anton Savchenko')
    expect(defaults.description).toContain('Anton Savchenko')
    expect(defaults.purpose).toContain('Anton Savchenko')
    expect(defaults.link).toBe('')
    expect(defaults.dueDate).toBe('')
    expect(defaults.colleagueIds).toEqual([])
  })
})
