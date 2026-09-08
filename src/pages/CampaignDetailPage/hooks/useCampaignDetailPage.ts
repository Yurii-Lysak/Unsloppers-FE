import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useActivateCampaignData, useCampaignCompletionData, useCampaignData } from '@/hooks/data/useCampaignsData'
import { useCampaignAudienceSection } from './useCampaignAudienceSection'

export const useCampaignDetailPage = () => {
  const navigate = useNavigate()
  const { campaignId = '' } = useParams()
  const { campaign, isCampaignLoading, isCampaignError } = useCampaignData(
    campaignId,
    Boolean(campaignId),
  )
  const audienceSection = useCampaignAudienceSection(campaign)
  const { activateCampaign, isActivatingCampaign } = useActivateCampaignData()
  const isActiveCampaign = campaign?.status === 'active'
  const {
    completion,
    isCompletionLoading,
    isCompletionError,
  } = useCampaignCompletionData(campaignId, isActiveCampaign)
  const [editOpen, setEditOpen] = useState(false)
  const [activateOpen, setActivateOpen] = useState(false)

  useEffect(() => {
    if (!campaignId) {
      navigate('/campaigns')
    }
  }, [campaignId, navigate])

  const handleActivate = async () => {
    try {
      await activateCampaign(campaignId)
      setActivateOpen(false)
    } catch (error) {
      const shouldCloseDialog =
        axios.isAxiosError(error) &&
        (error.response?.status === 409 || error.response?.status === 404)

      if (shouldCloseDialog) {
        setActivateOpen(false)
      }
    }
  }

  const setActivateOpenSafe = (open: boolean) => {
    if (!isActivatingCampaign) {
      setActivateOpen(open)
    }
  }

  return {
    campaignId,
    isRouteReady: Boolean(campaignId),
    campaign,
    isCampaignLoading,
    isCampaignError,
    ...audienceSection,
    editOpen,
    setEditOpen,
    activateOpen,
    setActivateOpen: setActivateOpenSafe,
    handleActivate,
    isActivatingCampaign,
    completion,
    isCompletionLoading,
    isCompletionError,
  }
}
