import { Megaphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/Button/Button'
import { CampaignFormDialog } from './components/CampaignFormDialog/CampaignFormDialog'
import { useCampaignsPage } from './hooks/useCampaignsPage'

export const CampaignsPage = () => {
  const { t } = useTranslation()
  const {
    campaignsList,
    isCampaignsLoading,
    isCampaignsError,
    dialogOpen,
    openCreate,
    closeDialog,
  } = useCampaignsPage()

  const hasCampaigns = Boolean(campaignsList && campaignsList.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold text-foreground" data-testid="campaigns-title">
            {t('campaigns.title')}
          </h1>
        </div>
        <Button onClick={openCreate} data-testid="campaigns-create">
          {t('campaigns.newCampaign')}
        </Button>
      </div>

      {isCampaignsLoading && (
        <p className="text-muted-foreground">{t('campaigns.loading')}</p>
      )}

      {isCampaignsError && (
        <p className="text-destructive">{t('campaigns.loadFailed')}</p>
      )}

      {!isCampaignsLoading && !isCampaignsError && !hasCampaigns && (
        <p className="text-muted-foreground" data-testid="campaigns-empty">
          {t('campaigns.empty')}
        </p>
      )}

      {hasCampaigns && (
        <ul
          className="divide-y divide-border rounded-lg border border-border"
          data-testid="campaigns-list"
        >
          {campaignsList?.map(campaign => {
            const isNavigable =
              campaign.status === 'draft' || campaign.status === 'active'
            return (
              <li
                key={campaign.id}
                className="flex w-full items-center justify-between gap-4 p-4"
                data-testid={`campaign-row-${campaign.id}`}
              >
                <div>
                  {isNavigable ? (
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      aria-label={t('campaigns.openCampaign', { title: campaign.title })}
                      className="font-medium text-primary hover:underline"
                      data-testid={`campaign-link-${campaign.id}`}
                    >
                      {campaign.title}
                    </Link>
                  ) : (
                    <p className="font-medium text-foreground">{campaign.title}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {campaign.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
                  <span>{t(`campaigns.status.${campaign.status}`)}</span>
                  <span>{campaign.dueDate}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <CampaignFormDialog
        campaign={undefined}
        open={dialogOpen}
        onClose={closeDialog}
      />
    </div>
  )
}
