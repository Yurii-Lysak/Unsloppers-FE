import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { DashboardQuickNavLink } from '@/types/dashboard'

interface QuickNavLinksProps {
  links: DashboardQuickNavLink[]
}

export const QuickNavLinks = ({ links }: QuickNavLinksProps) => {
  const { t } = useTranslation()

  return (
    <nav className="flex flex-wrap gap-3" data-testid="dashboard-quick-nav">
      {links.map(link => (
        <Link
          key={`${link.labelKey}-${link.path}`}
          to={link.path}
          className="text-sm font-medium text-primary hover:underline"
          data-testid={`dashboard-quick-nav-${link.labelKey.split('.').pop()}`}
        >
          {t(link.labelKey as never)}
        </Link>
      ))}
    </nav>
  )
}
