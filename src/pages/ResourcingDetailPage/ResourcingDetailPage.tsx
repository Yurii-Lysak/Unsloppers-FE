import { ArrowLeft, ClipboardList } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { AddExternalCandidateForm } from './components/AddExternalCandidateForm/AddExternalCandidateForm'
import { AddInternalCandidateForm } from './components/AddInternalCandidateForm/AddInternalCandidateForm'
import { DecisionReasonDialog } from './components/DecisionReasonDialog/DecisionReasonDialog'
import { ProposalList } from './components/ProposalList/ProposalList'
import { useResourcingDetailPage } from './hooks/useResourcingDetailPage'

export const ResourcingDetailPage = () => {
  const { t } = useTranslation()
  const {
    isRouteReady,
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
  } = useResourcingDetailPage()

  if (!isRouteReady) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={goBack}
          aria-label={t('resourcing.detail.back')}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <ClipboardList className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="resourcing-detail-title">
            {requestDetail?.department ?? t('resourcing.detail.loading')}
          </h1>
          {requestDetail && (
            <p className="text-sm text-muted-foreground">
              {t(`resourcing.status.${requestDetail.status}`)}
            </p>
          )}
        </div>
      </div>

      {isDetailLoading && (
        <p className="text-muted-foreground">{t('resourcing.detail.loading')}</p>
      )}
      {isDetailError && (
        <p className="text-destructive">{t('resourcing.detail.loadFailed')}</p>
      )}

      {requestDetail && (
        <>
          <section className="space-y-2 rounded-lg border border-border p-4">
            <h2 className="text-lg font-semibold">{t('resourcing.detail.summary')}</h2>
            <p className="text-sm text-muted-foreground">{requestDetail.vacancyDetails}</p>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-muted-foreground">{t('resourcing.form.duration')}</dt>
                <dd>{requestDetail.duration}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('resourcing.form.workload')}</dt>
                <dd>{requestDetail.workload}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t('resourcing.form.headcount')}</dt>
                <dd>
                  {isReviewingDm
                    ? t('resourcing.detail.approvedHeadcount', {
                        approved: requestDetail.approvedCount,
                        headcount: requestDetail.headcount,
                      })
                    : requestDetail.headcount}
                </dd>
              </div>
              {requestDetail.expectedCompBand && (
                <div>
                  <dt className="text-muted-foreground">
                    {t('resourcing.form.expectedCompBand')}
                  </dt>
                  <dd>{requestDetail.expectedCompBand}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="space-y-3 rounded-lg border border-border p-4">
            <h2 className="text-lg font-semibold">{t('resourcing.detail.proposals.title')}</h2>
            <ProposalList
              proposals={requestDetail.proposals}
              isReviewingDm={isReviewingDm}
              approvedCount={requestDetail.approvedCount}
              headcount={requestDetail.headcount}
              onApprove={proposalId => void handleApprove(proposalId)}
              onOpenReasonDialog={openReasonDialog}
              isDeciding={isDeciding}
            />
          </section>

          {isOpen && (
            <section className="space-y-4 rounded-lg border border-border p-4">
              <h2 className="text-lg font-semibold">{t('resourcing.detail.addCandidate.title')}</h2>
              <AddInternalCandidateForm
                candidatePool={requestDetail.candidatePool ?? []}
                onSubmitCandidate={addInternalCandidate}
                isSubmitting={isCreatingProposal}
              />
              <AddExternalCandidateForm
                onSubmitCandidate={addExternalCandidate}
                isSubmitting={isCreatingProposal}
              />
            </section>
          )}

          {isOpen && (
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                data-testid="resourcing-detail-submit"
              >
                {isSubmitting
                  ? t('resourcing.detail.submitting')
                  : t('resourcing.detail.submit')}
              </Button>
            </div>
          )}
        </>
      )}

      <DecisionReasonDialog
        key={decisionTargetProposal?.id ?? 'none'}
        open={decisionTargetProposal !== null}
        mode={decisionTargetProposal?.status === 'approved' ? 'reverse' : 'reject'}
        onClose={closeReasonDialog}
        onConfirm={confirmRejectOrReverse}
        isSubmitting={isDeciding}
      />
    </div>
  )
}
