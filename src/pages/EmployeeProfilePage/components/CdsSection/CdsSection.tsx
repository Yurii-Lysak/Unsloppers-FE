import { useTranslation } from 'react-i18next'
import type {
  CdsAssessmentEntry,
  CdsSection as CdsSectionData,
  ProfileSectionEnvelope,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'

interface CdsSectionCardProps {
  section: ProfileSectionEnvelope<CdsSectionData>
}

export const CdsSectionCard = ({ section }: CdsSectionCardProps) => {
  const { t } = useTranslation()

  if (!isSectionData<CdsSectionData>(section)) {
    return null
  }

  const { matrixLink, assessments } = section.data
  const entries = Array.isArray(assessments) ? assessments : []

  return (
    <div className="space-y-4" data-testid="cds-section">
      <div>
        <h3 className="text-sm font-medium text-foreground">
          {t('employeeProfile.s12.matrixLinkHeading')}
        </h3>
        {matrixLink ? (
          <a
            href={matrixLink}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-primary underline-offset-4 hover:underline"
            data-testid="cds-matrix-link"
          >
            {t('employeeProfile.s12.matrixLink')}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground" data-testid="cds-matrix-empty">
            {t('employeeProfile.s12.noMatrixLink')}
          </p>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground" data-testid="cds-assessments-empty">
          {t('employeeProfile.s12.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {entries.map(entry => (
            <CdsAssessmentEntryItem key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </div>
  )
}

const formatAssessmentDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const CdsAssessmentEntryItem = ({ entry }: { entry: CdsAssessmentEntry }) => {
  const { t } = useTranslation()

  return (
    <li
      className="rounded-md border border-border p-3 text-sm"
      data-testid={`cds-assessment-entry-${entry.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-medium text-foreground">
          {t('employeeProfile.s12.date', { date: formatAssessmentDate(entry.date) })}
        </p>
        <a
          href={entry.resultLink}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          {t('employeeProfile.s12.resultLink')}
        </a>
      </div>
      <p className="mt-2 text-muted-foreground">
        {t('employeeProfile.s12.assessor', { name: entry.assessor })}
      </p>
      <p className="mt-2 text-foreground">{entry.conclusion}</p>
    </li>
  )
}
