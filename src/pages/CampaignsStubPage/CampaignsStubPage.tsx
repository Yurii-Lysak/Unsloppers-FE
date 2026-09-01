import { useTranslation } from 'react-i18next'

export const CampaignsStubPage = () => {
  const { t } = useTranslation()

  return (
    <div className="p-6 text-muted-foreground" data-testid="campaigns-stub">
      {t('campaigns.comingSoon')}
    </div>
  )
}
