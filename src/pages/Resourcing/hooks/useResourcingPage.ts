import { useState } from 'react'
import {
  useResourcingAssignedListData,
  useResourcingListData,
  useResourcingPendingReviewListData,
} from '@/hooks/data/useResourcingData'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'

export const useResourcingPage = () => {
  const {
    canCreateResourcingRequests,
    canFulfilResourcingRequests,
    canApproveRejectCandidates,
  } = usePermissionsData()

  const { requestsList, isRequestsLoading, isRequestsError } =
    useResourcingListData(canCreateResourcingRequests)
  const { assignedList, isAssignedLoading, isAssignedError } =
    useResourcingAssignedListData(canFulfilResourcingRequests)
  const { pendingReviewList, isPendingReviewLoading, isPendingReviewError } =
    useResourcingPendingReviewListData(canApproveRejectCandidates)

  const [dialogOpen, setDialogOpen] = useState(false)

  const openCreate = () => {
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
  }

  return {
    canCreateResourcingRequests,
    canFulfilResourcingRequests,
    canApproveRejectCandidates,
    requestsList,
    isRequestsLoading,
    isRequestsError,
    assignedList,
    isAssignedLoading,
    isAssignedError,
    pendingReviewList,
    isPendingReviewLoading,
    isPendingReviewError,
    dialogOpen,
    openCreate,
    closeDialog,
  }
}
