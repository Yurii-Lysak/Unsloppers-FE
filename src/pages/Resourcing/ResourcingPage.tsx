import { ClipboardList } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import type { ResourcingRequest } from '@/types/resourcing'
import { ResourcingFormDialog } from './components/ResourcingFormDialog/ResourcingFormDialog'
import { useResourcingPage } from './hooks/useResourcingPage'

interface ResourcingRequestListProps {
  requests: ResourcingRequest[]
  testIdPrefix: string
  onOpen: (requestId: string) => void
}

const ResourcingRequestList = ({
  requests,
  testIdPrefix,
  onOpen,
}: ResourcingRequestListProps) => {
  const { t } = useTranslation()

  return (
    <ul
      className="divide-y divide-border rounded-lg border border-border"
      data-testid={`${testIdPrefix}-list`}
    >
      {requests.map(request => (
        <li key={request.id}>
          <button
            type="button"
            onClick={() => onOpen(request.id)}
            className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-accent"
            data-testid={`${testIdPrefix}-row-${request.id}`}
          >
            <div>
              <p className="font-medium text-foreground">{request.department}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {request.vacancyDetails}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
              <span>{t(`resourcing.status.${request.status}`)}</span>
              <span>{t('resourcing.list.headcount', { count: request.headcount })}</span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}

export const ResourcingPage = () => {
  const { t } = useTranslation()
  const {
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
    openRequest,
  } = useResourcingPage()

  const hasRequests = Boolean(requestsList && requestsList.length > 0)
  const hasAssigned = Boolean(assignedList && assignedList.length > 0)
  const hasPendingReview = Boolean(pendingReviewList && pendingReviewList.length > 0)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground" data-testid="resourcing-title">
            {t('resourcing.title')}
          </h1>
        </div>
        {canCreateResourcingRequests && (
          <Button onClick={openCreate} data-testid="resourcing-create">
            {t('resourcing.newRequest')}
          </Button>
        )}
      </div>

      {canApproveRejectCandidates && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            {t('resourcing.pendingReview.title')}
          </h2>

          {isPendingReviewLoading && (
            <p className="text-muted-foreground">{t('resourcing.pendingReview.loading')}</p>
          )}
          {isPendingReviewError && (
            <p className="text-destructive">{t('resourcing.pendingReview.loadFailed')}</p>
          )}
          {!isPendingReviewLoading && !isPendingReviewError && !hasPendingReview && (
            <p className="text-muted-foreground" data-testid="resourcing-pending-review-empty">
              {t('resourcing.pendingReview.empty')}
            </p>
          )}
          {hasPendingReview && (
            <ResourcingRequestList
              requests={pendingReviewList!}
              testIdPrefix="resourcing-pending-review"
              onOpen={openRequest}
            />
          )}
        </section>
      )}

      {canFulfilResourcingRequests && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            {t('resourcing.assigned.title')}
          </h2>

          {isAssignedLoading && (
            <p className="text-muted-foreground">{t('resourcing.assigned.loading')}</p>
          )}
          {isAssignedError && (
            <p className="text-destructive">{t('resourcing.assigned.loadFailed')}</p>
          )}
          {!isAssignedLoading && !isAssignedError && !hasAssigned && (
            <p className="text-muted-foreground" data-testid="resourcing-assigned-empty">
              {t('resourcing.assigned.empty')}
            </p>
          )}
          {hasAssigned && (
            <ResourcingRequestList
              requests={assignedList!}
              testIdPrefix="resourcing-assigned"
              onOpen={openRequest}
            />
          )}
        </section>
      )}

      {canCreateResourcingRequests && (
        <section className="space-y-3">
          {canFulfilResourcingRequests && (
            <h2 className="text-lg font-semibold text-foreground">
              {t('resourcing.myRequests.title')}
            </h2>
          )}

          {isRequestsLoading && (
            <p className="text-muted-foreground">{t('resourcing.loading')}</p>
          )}
          {isRequestsError && (
            <p className="text-destructive">{t('resourcing.loadFailed')}</p>
          )}
          {!isRequestsLoading && !isRequestsError && !hasRequests && (
            <p className="text-muted-foreground" data-testid="resourcing-empty">
              {t('resourcing.empty')}
            </p>
          )}
          {hasRequests && (
            <ResourcingRequestList
              requests={requestsList!}
              testIdPrefix="resourcing"
              onOpen={openRequest}
            />
          )}
        </section>
      )}

      <ResourcingFormDialog open={dialogOpen} onClose={closeDialog} />
    </div>
  )
}
