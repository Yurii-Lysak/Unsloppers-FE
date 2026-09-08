import type { Page } from '@playwright/test'
import { setupAuthApi } from './flows/authentication/helpers'
import { expect, test } from './shared/merged-fixtures'
import { testIds } from './shared/selectors'
import { testEnv } from './shared/test-env'
import { BUILTIN_FIELD_IDS } from '../src/types/employees'

const apiBaseUrl = testEnv.api.baseUrl

const reportEmployeeId = '11111111-1111-4111-8111-111111111101'
const peerEmployeeId = '22222222-2222-4222-8222-222222222222'

const gradeField = {
  id: BUILTIN_FIELD_IDS.grade,
  name: 'Grade',
  type: 'text',
  source: 'builtin',
  sortable: true,
  filterable: true,
  editable: true,
} as const

const nameField = {
  id: BUILTIN_FIELD_IDS.name,
  name: 'Name',
  type: 'text',
  source: 'builtin',
  sortable: true,
  filterable: true,
} as const

const buildListResponse = (gradeByEmployee: Record<string, string>) => ({
  fields: [nameField, gradeField],
  rows: [
    {
      employeeId: reportEmployeeId,
      cells: {
        [BUILTIN_FIELD_IDS.name]: 'Direct Report',
        [BUILTIN_FIELD_IDS.grade]: gradeByEmployee[reportEmployeeId] ?? 'Mid',
      },
      writableFieldIds: [BUILTIN_FIELD_IDS.grade],
    },
    {
      employeeId: peerEmployeeId,
      cells: {
        [BUILTIN_FIELD_IDS.name]: 'Peer Colleague',
        [BUILTIN_FIELD_IDS.grade]: gradeByEmployee[peerEmployeeId] ?? 'Mid',
      },
      writableFieldIds: [],
    },
  ],
  total: 2,
  page: 1,
  pageSize: 50,
})

interface InlineEditRouteOptions {
  patchStatus?: number
  onPatch?: (payload: { employeeId: string; fieldId: string; value: unknown }) => void
}

const routeDirectoryInlineEdit = async (
  page: Page,
  initialGrades: Record<string, string>,
  options: InlineEditRouteOptions = {},
) => {
  let listBody = buildListResponse(initialGrades)

  await page.route(`${apiBaseUrl}/api/v1/employees**`, async route => {
    const request = route.request()
    const url = request.url()

    if (request.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(listBody),
      })
      return
    }

    const patchMatch = url.match(
      /\/api\/v1\/employees\/([^/]+)\/fields\/([^/?]+)$/,
    )
    if (request.method() === 'PATCH' && patchMatch) {
      const employeeId = patchMatch[1]
      const fieldId = patchMatch[2]
      const payload = request.postDataJSON() as { value: unknown }

      options.onPatch?.({ employeeId, fieldId, value: payload.value })

      if (options.patchStatus && options.patchStatus >= 400) {
        await route.fulfill({
          status: options.patchStatus,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Forbidden',
            statusCode: options.patchStatus,
          }),
        })
        return
      }

      listBody = buildListResponse({
        ...initialGrades,
        [employeeId]: String(payload.value),
      })

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          employeeId,
          fieldId,
          value: payload.value,
        }),
      })
      return
    }

    await route.continue()
  })
}

const gradeCell = (page: Page, employeeId: string) =>
  page
    .getByTestId(testIds.employeeList.row(employeeId))
    .getByTestId(`directory-cell-${BUILTIN_FIELD_IDS.grade}`)

const gradeEditor = (page: Page, employeeId: string) =>
  page
    .getByTestId(testIds.employeeList.row(employeeId))
    .getByTestId(`directory-cell-editor-${BUILTIN_FIELD_IDS.grade}`)

const ACTION_DELAY_MS = 500

test.use({ launchOptions: { slowMo: ACTION_DELAY_MS } })

test.describe('Directory inline edit', () => {
  test('manager saves a writable grade cell with Enter and refetches the list', async ({
    page,
    interceptNetworkCall,
  }) => {
    const patchPayloads: Array<{ employeeId: string; fieldId: string; value: unknown }> =
      []

    await setupAuthApi(page, { authenticated: true })
    await routeDirectoryInlineEdit(
      page,
      {
        [reportEmployeeId]: 'Mid',
        [peerEmployeeId]: 'Mid',
      },
      {
        onPatch: payload => {
          patchPayloads.push(payload)
        },
      },
    )

    const listRefresh = interceptNetworkCall({
      url: `${apiBaseUrl}/api/v1/employees`,
      method: 'GET',
    })

    await page.goto('/employees')
    await expect(page.getByTestId(testIds.employeeList.table)).toBeVisible()

    await gradeCell(page, reportEmployeeId).click()
    const editor = gradeEditor(page, reportEmployeeId)
    await expect(editor).toBeVisible()
    await editor.fill('Senior')
    await editor.press('Enter')

    await expect.poll(() => patchPayloads).toEqual([
      {
        employeeId: reportEmployeeId,
        fieldId: BUILTIN_FIELD_IDS.grade,
        value: 'Senior',
      },
    ])

    await listRefresh.settled
    await expect(gradeCell(page, reportEmployeeId)).toHaveText('Senior')
    await expect(gradeEditor(page, reportEmployeeId)).toHaveCount(0)
  })

  test('colleague row grade renders read-only without an edit affordance', async ({
    page,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await routeDirectoryInlineEdit(page, {
      [reportEmployeeId]: 'Mid',
      [peerEmployeeId]: 'Mid',
    })

    await page.goto('/employees')

    await expect(gradeCell(page, reportEmployeeId)).toBeVisible()
    await expect(gradeCell(page, peerEmployeeId)).toHaveCount(0)
    await expect(
      page.getByTestId(testIds.employeeList.row(peerEmployeeId)),
    ).toContainText('Mid')
  })

  test('Escape reverts the draft without calling PATCH', async ({ page }) => {
    let patchCount = 0

    await setupAuthApi(page, { authenticated: true })
    await routeDirectoryInlineEdit(page, {
      [reportEmployeeId]: 'Mid',
      [peerEmployeeId]: 'Mid',
    })
    await page.route(`${apiBaseUrl}/api/v1/employees/**/fields/**`, async route => {
      if (route.request().method() === 'PATCH') {
        patchCount += 1
      }
      await route.continue()
    })

    await page.goto('/employees')
    await gradeCell(page, reportEmployeeId).click()

    const editor = gradeEditor(page, reportEmployeeId)
    await editor.fill('Senior')
    await editor.press('Escape')

    await expect(gradeCell(page, reportEmployeeId)).toHaveText('Mid')
    await expect(gradeEditor(page, reportEmployeeId)).toHaveCount(0)
    expect(patchCount).toBe(0)
  })

  test('shows a destructive toast when PATCH fails and keeps the cell editable', async ({
    page,
  }) => {
    await setupAuthApi(page, { authenticated: true })
    await routeDirectoryInlineEdit(
      page,
      {
        [reportEmployeeId]: 'Mid',
        [peerEmployeeId]: 'Mid',
      },
      { patchStatus: 403 },
    )

    await page.goto('/employees')
    await gradeCell(page, reportEmployeeId).click()

    const editor = gradeEditor(page, reportEmployeeId)
    await editor.fill('Senior')
    await editor.press('Enter')

    await expect(page.getByText("Couldn't save. Try again.")).toBeVisible()
    await expect(gradeEditor(page, reportEmployeeId)).toBeVisible()
    await expect(editor).toHaveValue('Senior')
  })
})
