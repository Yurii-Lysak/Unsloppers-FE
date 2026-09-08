import { ClipboardList } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { ResourcingFormDialog } from './components/ResourcingFormDialog/ResourcingFormDialog'
import { useResourcingPage } from './hooks/useResourcingPage'

export const ResourcingPage = () => {
  const { t } = useTranslation()
  const {
    requestsList,
    isRequestsLoading,
    isRequestsError,
    dialogOpen,
    openCreate,
    closeDialog,
  } = useResourcingPage()

  const hasRequests = Boolean(requestsList && requestsList.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground" data-testid="resourcing-title">
            {t('resourcing.title')}
          </h1>
        </div>
        <Button onClick={openCreate} data-testid="resourcing-create">
          {t('resourcing.newRequest')}
        </Button>
      </div>

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
        <ul
          className="divide-y divide-border rounded-lg border border-border"
          data-testid="resourcing-list"
        >
          {requestsList?.map(request => (
            <li
              key={request.id}
              className="flex w-full items-center justify-between gap-4 p-4"
              data-testid={`resourcing-row-${request.id}`}
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
            </li>
          ))}
        </ul>
      )}

      <ResourcingFormDialog open={dialogOpen} onClose={closeDialog} />
    </div>
  )
}
