import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSharedLinkProfile } from '@/api/hooks/useSharedLinks'
import type { EmployeeProfile, SectionId } from '@/types/employee-profile'
import {
  orderedProfileSectionIds,
  PROFILE_SECTION_RENDERERS,
  PROFILE_SECTION_TITLE_KEYS,
} from '@/pages/EmployeeProfilePage/profile-sections'
import { SHAREABLE_SECTION_TITLE_KEYS } from '@/pages/EmployeeProfilePage/shared-link-sections'

export const SharedLinkViewPage = () => {
  const { token = '' } = useParams()
  const { t } = useTranslation()
  const { data: profile, isLoading, isError } = useSharedLinkProfile(token)

  const enabledSectionLabels = useMemo(() => {
    if (!profile) {
      return []
    }
    return orderedProfileSectionIds(profile.sections).map((sectionId) =>
      sectionTitle(t, sectionId),
    )
  }, [profile, t])

  if (!token) {
    return (
      <p className="text-destructive" role="alert">
        {t('employeeProfile.sharedLink.invalidToken')}
      </p>
    )
  }

  return (
    <div className="space-y-6" data-testid="shared-link-view">
      <div className="border-b border-border pb-4">
        <p className="text-sm text-muted-foreground">
          <Link to="/employees">{t('employeeProfile.backToList')}</Link>
        </p>
        <h1 className="text-3xl font-bold text-foreground">
          {isLoading
            ? t('employeeProfile.loading')
            : (profile?.displayName ?? t('employeeProfile.sharedLink.title'))}
        </h1>
        {profile && (
          <p
            className="mt-2 text-sm text-muted-foreground"
            data-testid="employee-profile-access-chip"
          >
            {t('employeeProfile.sharedLink.viewingScope', {
              sections: enabledSectionLabels.join(', '),
            })}
          </p>
        )}
      </div>

      {isError && (
        <p className="text-destructive" data-testid="shared-link-error">
          {t('employeeProfile.sharedLink.loadFailed')}
        </p>
      )}

      {profile && <SharedLinkProfileSections profile={profile} />}
    </div>
  )
}

const SharedLinkProfileSections = ({ profile }: { profile: EmployeeProfile }) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4" data-testid="employee-profile-sections">
      {orderedProfileSectionIds(profile.sections).map((sectionId) => {
        const section = profile.sections[sectionId]!
        const renderer = PROFILE_SECTION_RENDERERS[sectionId]
        const title = sectionTitle(t, sectionId)

        return (
          <section
            key={sectionId}
            className="rounded-lg border border-border p-4"
            data-testid={`profile-section-${sectionId.toLowerCase()}`}
          >
            <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
            {'status' in section && section.status === 'unavailable' ? (
              <p className="text-sm text-muted-foreground">
                {t('employeeProfile.unavailableSection')}
              </p>
            ) : renderer ? (
              renderer({
                employeeId: profile.employeeId,
                section,
                accessLevel: section.accessLevel,
                t,
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                {t('employeeProfile.emptySection')}
              </p>
            )}
          </section>
        )
      })}
    </div>
  )
}

const sectionTitle = (
  t: (key: string, options?: { id: string }) => string,
  sectionId: SectionId,
): string => {
  const titleKey =
    PROFILE_SECTION_TITLE_KEYS[sectionId] ??
    SHAREABLE_SECTION_TITLE_KEYS[sectionId]
  if (titleKey && !titleKey.endsWith('generic')) {
    return t(titleKey)
  }
  return t('employeeProfile.sections.generic', { id: sectionId })
}
