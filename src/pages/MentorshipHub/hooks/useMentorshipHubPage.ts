import { useState } from 'react'
import { useMentorshipHubData } from '@/hooks/data/useMentorshipData'
import { usePermissionsData } from '@/hooks/data/usePermissionsData'
import type { ActiveMentorshipPair, MentorshipPairListFilter, WillingMentor } from '@/types/mentorship'

export const useMentorshipHubPage = () => {
  const { canAssignEndMentorships } = usePermissionsData()
  const [pairStatusFilter, setPairStatusFilter] =
    useState<MentorshipPairListFilter>('all')
  const {
    willingMentors,
    assignableMentees,
    pairs,
    isMentorsLoading,
    isMenteesLoading,
    isPairsLoading,
    isMentorsError,
    isMenteesError,
    isPairsError,
  } = useMentorshipHubData(pairStatusFilter, canAssignEndMentorships)

  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<WillingMentor | null>(
    null,
  )
  const [endDialogOpen, setEndDialogOpen] = useState(false)
  const [selectedPair, setSelectedPair] = useState<ActiveMentorshipPair | null>(
    null,
  )

  const openAssignDialog = (mentor: WillingMentor) => {
    setSelectedMentor(mentor)
    setAssignDialogOpen(true)
  }

  const closeAssignDialog = () => {
    setAssignDialogOpen(false)
    setSelectedMentor(null)
  }

  const openEndDialog = (pair: ActiveMentorshipPair) => {
    setSelectedPair(pair)
    setEndDialogOpen(true)
  }

  const closeEndDialog = () => {
    setEndDialogOpen(false)
    setSelectedPair(null)
  }

  return {
    willingMentors,
    assignableMentees,
    pairs,
    pairStatusFilter,
    setPairStatusFilter,
    isMentorsLoading,
    isMenteesLoading,
    isPairsLoading,
    isMentorsError,
    isMenteesError,
    isPairsError,
    assignDialogOpen,
    selectedMentor,
    openAssignDialog,
    closeAssignDialog,
    endDialogOpen,
    selectedPair,
    openEndDialog,
    closeEndDialog,
  }
}
