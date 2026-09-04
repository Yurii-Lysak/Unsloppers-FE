import { useMemo, useState } from 'react'
import { resolveAudiencePreview, resolveAudienceRows } from '@/components/AudienceBuilder/resolve-audience-preview'
import { useSaveCampaignAudienceData } from '@/hooks/data/useCampaignsData'
import { useEmployeesListData } from '@/hooks/data/useEmployeesData'
import type { Campaign, CampaignAudienceDefinition } from '@/types/campaigns'
import { BUILTIN_FIELD_IDS } from '@/types/employees'

const emptyAudience = (): CampaignAudienceDefinition => ({
  filters: [],
  addedEmployeeIds: [],
  excludedEmployeeIds: [],
})

const PREVIEW_PAGE = 1
const PREVIEW_PAGE_SIZE = 50
const EMPLOYEE_LIST_PAGE_SIZE = 100

export const useCampaignAudienceSection = (campaign?: Campaign) => {
  const [draftAudience, setDraftAudience] = useState<CampaignAudienceDefinition | null>(null)
  const { saveCampaignAudience, isSavingCampaignAudience } = useSaveCampaignAudienceData()

  const definition = useMemo(
    () => draftAudience ?? campaign?.audience ?? emptyAudience(),
    [campaign?.audience, draftAudience],
  )

  const { employeesList, isEmployeesLoading } = useEmployeesListData({
    page: 1,
    pageSize: EMPLOYEE_LIST_PAGE_SIZE,
  })

  const preview = useMemo(() => {
    if (!employeesList) {
      return undefined
    }
    return resolveAudiencePreview(
      employeesList,
      definition,
      PREVIEW_PAGE,
      PREVIEW_PAGE_SIZE,
    )
  }, [definition, employeesList])

  const resolvedIdSet = useMemo(() => {
    if (!employeesList) {
      return new Set<string>()
    }
    return new Set(resolveAudienceRows(employeesList, definition).map(row => row.employeeId))
  }, [definition, employeesList])

  const addCandidateOptions = useMemo(() => {
    if (!employeesList) {
      return []
    }
    return employeesList.rows
      .filter(row => !resolvedIdSet.has(row.employeeId))
      .map(row => ({
        value: row.employeeId,
        label: String(row.cells[BUILTIN_FIELD_IDS.name] ?? row.employeeId),
      }))
  }, [employeesList, resolvedIdSet])

  const saveAudience = async () => {
    if (!campaign) {
      return
    }
    await saveCampaignAudience(campaign.id, definition)
    setDraftAudience(null)
  }

  return {
    definition,
    setDefinition: (next: CampaignAudienceDefinition) => setDraftAudience(next),
    preview,
    fieldCatalog: employeesList?.fields,
    isPreviewLoading: isEmployeesLoading,
    addCandidateOptions,
    saveAudience,
    isSavingAudience: isSavingCampaignAudience,
  }
}
