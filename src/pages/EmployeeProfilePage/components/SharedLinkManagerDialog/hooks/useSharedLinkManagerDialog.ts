import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useCreateSharedLink,
  useRevokeSharedLink,
  useSharedLinkAccessLog,
  useSharedLinksList,
} from '@/api/hooks/useSharedLinks'
import { useEmployeeList } from '@/api/hooks/useEmployeeList'
import type { SectionId } from '@/types/employee-profile'
import { SHAREABLE_CFG_SECTIONS } from '../../../shared-link-sections'

const EXPIRY_PRESETS = [
  { hours: 1, labelKey: 'employeeProfile.sharedLink.expiry.1h' },
  { hours: 24, labelKey: 'employeeProfile.sharedLink.expiry.24h' },
  { hours: 48, labelKey: 'employeeProfile.sharedLink.expiry.48h' },
  { hours: 168, labelKey: 'employeeProfile.sharedLink.expiry.168h' },
] as const

interface UseSharedLinkManagerDialogOptions {
  employeeId: string
  open: boolean
  onClose: () => void
  canCreate: boolean
  canManage: boolean
}

export const useSharedLinkManagerDialog = ({
  employeeId,
  open,
  onClose,
  canCreate,
  canManage,
}: UseSharedLinkManagerDialogOptions) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>(
    canCreate ? 'create' : 'manage',
  )
  const [recipientEmployeeId, setRecipientEmployeeId] = useState('')
  const [selectedSections, setSelectedSections] = useState<SectionId[]>([])
  const [expiresInHours, setExpiresInHours] = useState(24)
  const [createdUrl, setCreatedUrl] = useState<string | null>(null)
  const [rootError, setRootError] = useState<string | null>(null)
  const [expandedLogLinkId, setExpandedLogLinkId] = useState<string | null>(null)

  const { data: employeeList, isLoading: isRecipientsLoading } = useEmployeeList({
    page: 1,
    pageSize: 100,
  })

  const createMutation = useCreateSharedLink(employeeId)
  const revokeMutation = useRevokeSharedLink(employeeId)
  const {
    data: activeLinks,
    isLoading: isLinksLoading,
    isError: isLinksError,
    refetch: refetchLinks,
  } = useSharedLinksList(employeeId, open && activeTab === 'manage' && canManage)

  const accessLogQuery = useSharedLinkAccessLog(employeeId, expandedLogLinkId)

  const recipientOptions = useMemo(() => {
    if (!employeeList?.rows) {
      return []
    }
    return employeeList.rows
      .filter((row) => row.employeeId !== employeeId)
      .map((row) => ({
        value: row.employeeId,
        label:
          typeof row.cells.name === 'string' && row.cells.name.trim()
            ? row.cells.name
            : row.employeeId,
      }))
  }, [employeeList, employeeId])

  const toggleSection = (sectionId: SectionId) => {
    setSelectedSections((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId],
    )
  }

  const resetForm = () => {
    setRecipientEmployeeId('')
    setSelectedSections([])
    setExpiresInHours(24)
    setCreatedUrl(null)
    setRootError(null)
    setExpandedLogLinkId(null)
    setActiveTab(canCreate ? 'create' : 'manage')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleCreate = async () => {
    setRootError(null)
    if (!recipientEmployeeId) {
      setRootError(t('employeeProfile.sharedLink.recipientRequired'))
      return
    }

    try {
      const result = await createMutation.mutateAsync({
        recipientEmployeeId,
        sections: selectedSections.length > 0 ? selectedSections : undefined,
        expiresInHours,
      })
      setCreatedUrl(result.url)
    } catch {
      setRootError(t('employeeProfile.sharedLink.createFailed'))
    }
  }

  const handleCopyUrl = async () => {
    if (!createdUrl) {
      return
    }
    const absoluteUrl = `${window.location.origin}${createdUrl}`
    await navigator.clipboard.writeText(absoluteUrl)
  }

  const handleRevoke = async (linkId: string) => {
    setRootError(null)
    try {
      await revokeMutation.mutateAsync(linkId)
      if (expandedLogLinkId === linkId) {
        setExpandedLogLinkId(null)
      }
      await refetchLinks()
    } catch {
      setRootError(t('employeeProfile.sharedLink.revokeFailed'))
    }
  }

  const toggleAccessLog = (linkId: string) => {
    setExpandedLogLinkId((current) => (current === linkId ? null : linkId))
  }

  return {
    t,
    activeTab,
    setActiveTab,
    recipientEmployeeId,
    setRecipientEmployeeId,
    selectedSections,
    toggleSection,
    shareableSections: SHAREABLE_CFG_SECTIONS,
    expiryPresets: EXPIRY_PRESETS,
    expiresInHours,
    setExpiresInHours,
    recipientOptions,
    isRecipientsLoading,
    createdUrl,
    rootError,
    isSubmitting: createMutation.isPending,
    handleCreate,
    handleCopyUrl,
    handleClose,
    open,
    activeLinks: activeLinks?.links ?? [],
    isLinksLoading,
    isLinksError,
    handleRevoke,
    isRevoking: revokeMutation.isPending,
    expandedLogLinkId,
    toggleAccessLog,
    accessLogEntries: accessLogQuery.data?.entries ?? [],
    isAccessLogLoading: accessLogQuery.isLoading,
    isAccessLogError: accessLogQuery.isError,
  }
}
