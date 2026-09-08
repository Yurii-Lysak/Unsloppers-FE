import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useResourcingAssignedListData,
  useResourcingListData,
} from '@/hooks/data/useResourcingData'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'

export const useResourcingPage = () => {
  const navigate = useNavigate()
  const { canCreateResourcingRequests, canFulfilResourcingRequests } =
    usePermissionsData()

  const { requestsList, isRequestsLoading, isRequestsError } =
    useResourcingListData(canCreateResourcingRequests)
  const { assignedList, isAssignedLoading, isAssignedError } =
    useResourcingAssignedListData(canFulfilResourcingRequests)

  const [dialogOpen, setDialogOpen] = useState(false)

  const openCreate = () => {
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
  }

  const openRequest = (requestId: string) => {
    navigate(`/resourcing/${requestId}`)
  }

  return {
    canCreateResourcingRequests,
    canFulfilResourcingRequests,
    requestsList,
    isRequestsLoading,
    isRequestsError,
    assignedList,
    isAssignedLoading,
    isAssignedError,
    dialogOpen,
    openCreate,
    closeDialog,
    openRequest,
  }
}
