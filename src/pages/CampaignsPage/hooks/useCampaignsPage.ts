import { useState } from 'react'
import { useCampaignsListData } from '@/hooks/data/useCampaignsData'
import type { Campaign } from '@/types/campaigns'

export const useCampaignsPage = () => {
  const { campaignsList, isCampaignsLoading, isCampaignsError } =
    useCampaignsListData()
  const [dialogCampaign, setDialogCampaign] = useState<Campaign | undefined>(
    undefined,
  )
  const [dialogOpen, setDialogOpen] = useState(false)

  const openCreate = () => {
    setDialogCampaign(undefined)
    setDialogOpen(true)
  }

  const openEdit = (campaign: Campaign) => {
    setDialogCampaign(campaign)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setDialogCampaign(undefined)
  }

  return {
    campaignsList,
    isCampaignsLoading,
    isCampaignsError,
    dialogCampaign,
    dialogOpen,
    openCreate,
    openEdit,
    closeDialog,
  }
}
