import { useState } from 'react'
import { useResourcingListData } from '@/hooks/data/useResourcingData'

export const useResourcingPage = () => {
  const { requestsList, isRequestsLoading, isRequestsError } =
    useResourcingListData()
  const [dialogOpen, setDialogOpen] = useState(false)

  const openCreate = () => {
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
  }

  return {
    requestsList,
    isRequestsLoading,
    isRequestsError,
    dialogOpen,
    openCreate,
    closeDialog,
  }
}
