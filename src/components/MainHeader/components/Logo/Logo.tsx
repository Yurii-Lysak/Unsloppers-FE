import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const Logo = () => {
  const { t } = useTranslation()

  return (
    <Link
      to="/"
      className="flex h-full items-center px-4 text-2xl font-semibold text-sidebar-foreground hover:opacity-80 transition-opacity"
    >
      {t('app.brand')}
    </Link>
  )
}
