import { ArrowLeft, Megaphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { AudienceBuilder } from '@/components/AudienceBuilder/AudienceBuilder'
import { Button } from '@/components/Button/Button'
import { ConfirmationModal } from '@/components/ConfirmationModal/ConfirmationModal'
import { CampaignFormDialog } from '@/pages/CampaignsPage/components/CampaignFormDialog/CampaignFormDialog'
import { useCampaignDetailPage } from './hooks/useCampaignDetailPage'

export const CampaignDetailPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    isRouteReady,
    campaign,
    isCampaignLoading,
    isCampaignError,
    definition,
    setDefinition,
    preview,
    fieldCatalog,
    isPreviewLoading,
    addCandidateOptions,
    saveAudience,
    isSavingAudience,
    editOpen,
    setEditOpen,
    activateOpen,
    setActivateOpen,
    handleActivate,
    isActivatingCampaign,
  } = useCampaignDetailPage()

  if (!isRouteReady) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate('/campaigns')}
            aria-label={t('campaigns.detail.back')}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <Megaphone className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="campaign-detail-title">
              {campaign?.title ?? t('campaigns.detail.loading')}
            </h1>
            {campaign && (
              <p className="text-sm text-muted-foreground">
                {t(`campaigns.status.${campaign.status}`)} · {campaign.dueDate}
              </p>
            )}
          </div>
        </div>
        {campaign?.status === 'draft' && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditOpen(true)}
              data-testid="campaign-detail-edit"
            >
              {t('campaigns.editCampaign')}
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={() => setActivateOpen(true)}
              data-testid="campaign-detail-activate"
            >
              {t('campaigns.activate.action')}
            </Button>
          </div>
        )}
      </div>

      {isCampaignLoading && (
        <p className="text-muted-foreground">{t('campaigns.detail.loading')}</p>
      )}

      {isCampaignError && (
        <p className="text-destructive">{t('campaigns.loadFailed')}</p>
      )}

      {campaign && (
        <>
          <section className="space-y-2 rounded-lg border border-border p-4">
            <h2 className="text-lg font-semibold">{t('campaigns.detail.summary')}</h2>
            <p className="text-sm text-muted-foreground">{campaign.description}</p>
            <p className="text-sm">
              <span className="font-medium">{t('campaigns.form.purpose')}:</span> {campaign.purpose}
            </p>
            <p className="text-sm">
              <Link to={campaign.link} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                {campaign.link}
              </Link>
            </p>
          </section>

          {campaign.status === 'draft' && (
            <section className="space-y-3 rounded-lg border border-border p-4">
              <h2 className="text-lg font-semibold">{t('campaigns.audience.title')}</h2>
              <AudienceBuilder
                definition={definition}
                preview={preview}
                fieldCatalog={fieldCatalog}
                isPreviewLoading={isPreviewLoading}
                addCandidateOptions={addCandidateOptions}
                onDefinitionChange={setDefinition}
                onSave={saveAudience}
                isSaving={isSavingAudience}
              />
            </section>
          )}
        </>
      )}

      <CampaignFormDialog
        campaign={campaign}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      <ConfirmationModal
        open={activateOpen}
        onOpenChange={setActivateOpen}
        title={t('campaigns.activate.dialogTitle')}
        description={t('campaigns.activate.dialogDescription')}
        confirmLabel={
          isActivatingCampaign
            ? t('campaigns.activate.activating')
            : t('campaigns.activate.confirm')
        }
        cancelLabel={t('campaigns.cancel')}
        confirmVariant="destructive"
        confirmDisabled={isActivatingCampaign}
        onConfirm={handleActivate}
      />
    </div>
  )
}
