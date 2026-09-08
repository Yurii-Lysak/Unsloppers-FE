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
  } = useResourcingFulfilData(requestId, Boolean(requestId))

  const isOpen = requestDetail?.status === 'open'
  const canSubmit = isOpen && (requestDetail?.proposals.length ?? 0) > 0

  const addInternalCandidate = async (candidateEmployeeId: string) => {
    await createProposal({ candidateEmployeeId })
  }

  const addExternalCandidate = async (input: CreateResourcingProposalInput) => {
    await createProposal(input)
  }

  const handleSubmit = async () => {
    await submitRequest()
  }

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
    addInternalCandidate,
    addExternalCandidate,
    isCreatingProposal,
    handleSubmit,
    isSubmitting,
    goBack,
  }
}
