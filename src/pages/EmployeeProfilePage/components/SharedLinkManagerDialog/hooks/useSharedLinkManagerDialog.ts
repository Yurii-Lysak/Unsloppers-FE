import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCreateSharedLink } from '@/api/hooks/useSharedLinks'
import { useEmployeeList } from '@/api/hooks/useEmployeeList'
import type { SectionId } from '@/types/employee-profile'
import { SHAREABLE_CFG_SECTIONS } from '../../../shared-link-sections'

interface UseSharedLinkManagerDialogOptions {
  employeeId: string
  open: boolean
  onClose: () => void
}

export const useSharedLinkManagerDialog = ({
  employeeId,
  open,
  onClose,
}: UseSharedLinkManagerDialogOptions) => {
  const { t } = useTranslation()
  const [recipientEmployeeId, setRecipientEmployeeId] = useState('')
  const [selectedSections, setSelectedSections] = useState<SectionId[]>([])
  const [createdUrl, setCreatedUrl] = useState<string | null>(null)
  const [rootError, setRootError] = useState<string | null>(null)

  const { data: employeeList, isLoading: isRecipientsLoading } = useEmployeeList({
    page: 1,
    pageSize: 100,
  })

  const createMutation = useCreateSharedLink(employeeId)

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
    setCreatedUrl(null)
    setRootError(null)
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

  return {
    t,
    recipientEmployeeId,
    setRecipientEmployeeId,
    selectedSections,
    toggleSection,
    shareableSections: SHAREABLE_CFG_SECTIONS,
    recipientOptions,
    isRecipientsLoading,
    createdUrl,
    rootError,
    isSubmitting: createMutation.isPending,
    handleCreate,
    handleCopyUrl,
    handleClose,
    open,
  }
}
