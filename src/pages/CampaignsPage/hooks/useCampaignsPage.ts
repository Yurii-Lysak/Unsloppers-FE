import { useState } from 'react'
import { useCampaignsListData } from '@/hooks/data/useCampaignsData'

export const useCampaignsPage = () => {
  const { campaignsList, isCampaignsLoading, isCampaignsError } =
    useCampaignsListData()
  const [dialogOpen, setDialogOpen] = useState(false)

  const openCreate = () => {
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
  }

  return {
    campaignsList,
    isCampaignsLoading,
    isCampaignsError,
    dialogOpen,
    openCreate,
    closeDialog,
  }
}
