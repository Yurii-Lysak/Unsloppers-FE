import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const QUICK_NAV_LINKS = [
  { labelKey: 'dashboard.quickNav.employees', path: '/employees' },
  { labelKey: 'dashboard.quickNav.risks', path: '/risks' },
  { labelKey: 'dashboard.quickNav.campaigns', path: '/campaigns' },
] as const

export const QuickNavLinks = () => {
  const { t } = useTranslation()

  return (
    <nav className="flex flex-wrap gap-3" data-testid="dashboard-quick-nav">
      {QUICK_NAV_LINKS.map(link => (
        <Link
          key={link.path}
          to={link.path}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t(link.labelKey)}
        </Link>
      ))}
    </nav>
  )
}
