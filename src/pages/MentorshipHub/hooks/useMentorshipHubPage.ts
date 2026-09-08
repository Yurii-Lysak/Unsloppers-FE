import { useState } from 'react'
import { useMentorshipHubData } from '@/hooks/data/useMentorshipData'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'
import type { WillingMentor } from '@/types/mentorship'

export const useMentorshipHubPage = () => {
  const { canAssignEndMentorships } = usePermissionsData()
  const {
    willingMentors,
    assignableMentees,
    isMentorsLoading,
    isMenteesLoading,
    isMentorsError,
    isMenteesError,
  } = useMentorshipHubData(canAssignEndMentorships)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<WillingMentor | null>(
    null,
  )

  const openAssignDialog = (mentor: WillingMentor) => {
    setSelectedMentor(mentor)
    setDialogOpen(true)
  }

  const closeAssignDialog = () => {
    setDialogOpen(false)
    setSelectedMentor(null)
  }

  return {
    willingMentors,
    assignableMentees,
    isMentorsLoading,
    isMenteesLoading,
    isMentorsError,
    isMenteesError,
    dialogOpen,
    selectedMentor,
    openAssignDialog,
    closeAssignDialog,
  }
}
