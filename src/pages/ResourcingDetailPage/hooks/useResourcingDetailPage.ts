import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useResourcingFulfilData } from '@/hooks/data/useResourcingData'
import type { CreateResourcingProposalInput } from '@/types/resourcing'

export const useResourcingDetailPage = () => {
  const navigate = useNavigate()
  const { requestId = '' } = useParams()

  const {
    requestDetail,
    isDetailLoading,
    isDetailError,
    createProposal,
    isCreatingProposal,
    submitRequest,
    isSubmitting,
    decideProposal,
    isDeciding,
  } = useResourcingFulfilData(requestId, Boolean(requestId))

  const [decisionTargetProposalId, setDecisionTargetProposalId] = useState<
    string | null
  >(null)

  const isOpen = requestDetail?.status === 'open'
  const canSubmit = isOpen && (requestDetail?.proposals.length ?? 0) > 0
  const isReviewingDm = requestDetail?.viewerIsReviewingDm ?? false

  const addInternalCandidate = async (candidateEmployeeId: string) => {
    await createProposal({ candidateEmployeeId })
  }

  const addExternalCandidate = async (input: CreateResourcingProposalInput) => {
    await createProposal(input)
  }

  const handleSubmit = async () => {
    await submitRequest()
  }

  const handleApprove = async (proposalId: string) => {
    await decideProposal(proposalId, { decision: 'approved' })
  }

  const openReasonDialog = (proposalId: string) => {
    setDecisionTargetProposalId(proposalId)
  }

  const closeReasonDialog = () => {
    setDecisionTargetProposalId(null)
  }

  const confirmRejectOrReverse = async (reason: string) => {
    if (!decisionTargetProposalId) {
      return
    }
    await decideProposal(decisionTargetProposalId, { decision: 'rejected', reason })
    setDecisionTargetProposalId(null)
  }

  const decisionTargetProposal =
    requestDetail?.proposals.find(proposal => proposal.id === decisionTargetProposalId) ??
    null

  const goBack = () => {
    navigate('/resourcing')
  }

  return {
    isRouteReady: Boolean(requestId),
    requestDetail,
    isDetailLoading,
    isDetailError,
    isOpen,
    canSubmit,
    isReviewingDm,
    addInternalCandidate,
    addExternalCandidate,
    isCreatingProposal,
    handleSubmit,
    isSubmitting,
    handleApprove,
    isDeciding,
    decisionTargetProposal,
    openReasonDialog,
    closeReasonDialog,
    confirmRejectOrReverse,
    goBack,
  }
}
