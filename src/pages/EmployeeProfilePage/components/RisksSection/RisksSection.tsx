import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { FormRootError } from '@/components/Form/components/FormRootError/FormRootError'
import { Input } from '@/components/Input/Input'
import { RiskBadge } from '@/components/RiskBadge/RiskBadge'
import { riskLevelLabelKey } from '@/components/RiskBadge/risk-level-styles'
import { Select } from '@/components/Select/Select'
import { Textarea } from '@/components/Textarea/Textarea'
import { TrendArrow } from '@/components/TrendArrow/TrendArrow'
import type {
  ProfileSectionEnvelope,
  RiskRecord,
  RisksSection as RisksSectionData,
  SectionAccessLevel,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'
import { RISK_LEVELS } from './schemas/risk-record-form.schema'
import { useAddRiskRecordForm } from './hooks/useRisksSection'

interface RisksSectionCardProps {
  employeeId: string
  section: ProfileSectionEnvelope<RisksSectionData>
  accessLevel: Exclude<SectionAccessLevel, 'none'>
}

export const RisksSectionCard = ({
  employeeId,
  section,
  accessLevel,
}: RisksSectionCardProps) => {
  const { t } = useTranslation()

  if (!isSectionData<RisksSectionData>(section)) {
    return null
  }

  const { records, currentLevel, trend } = section.data
  const canWrite = accessLevel === 'RW'

  return (
    <div className="space-y-4" data-testid="risks-section">
      {currentLevel && (
        <div
          className="flex items-center gap-2"
          data-testid="risks-current-level"
        >
          <RiskBadge level={currentLevel} />
          {records.length >= 2 && (
            <TrendArrow trend={trend} level={currentLevel} />
          )}
        </div>
      )}

      {records.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('employeeProfile.s6.empty')}
        </p>
      ) : (
        <ul className="space-y-3">
          {records.map(record => (
            <RiskRecordItem key={record.id} record={record} />
          ))}
        </ul>
      )}

      {canWrite && <AddRiskRecordForm employeeId={employeeId} />}
    </div>
  )
}

const RiskRecordItem = ({ record }: { record: RiskRecord }) => {
  const { t } = useTranslation()

  return (
    <li
      className="rounded-md border border-border p-3 text-sm"
      data-testid={`risk-record-${record.id}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium text-foreground">
          {t(riskLevelLabelKey(record.level))}
        </p>
        <p className="text-xs text-muted-foreground">{record.recordedAt}</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {record.author.displayName}
      </p>
      <p className="mt-2 font-medium text-foreground">{record.description}</p>
      <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
        {record.details}
      </p>
    </li>
  )
}

const AddRiskRecordForm = ({ employeeId }: { employeeId: string }) => {
  const { t } = useTranslation()
  const { form, onSubmit, isCreatingRecord } = useAddRiskRecordForm(employeeId)

  const levelOptions = RISK_LEVELS.map(level => ({
    value: level,
    label: t(riskLevelLabelKey(level)),
  }))

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      className="space-y-2 border-t border-border pt-4"
    >
      <h3 className="text-sm font-medium text-foreground">
        {t('employeeProfile.s6.addRecord')}
      </h3>
      <Select
        name="level"
        label={t('employeeProfile.s6.level')}
        options={levelOptions}
        data-testid="risk-add-level"
      />
      <Input
        name="recordedAt"
        type="date"
        label={t('employeeProfile.s6.recordedAt')}
        data-testid="risk-add-recorded-at"
      />
      <Input
        name="description"
        label={t('employeeProfile.s6.description')}
        data-testid="risk-add-description"
      />
      <Textarea
        name="details"
        label={t('employeeProfile.s6.details')}
        className="min-h-20"
        data-testid="risk-add-details"
      />
      <FormRootError />
      <Button type="submit" size="sm" disabled={isCreatingRecord}>
        {t('employeeProfile.s6.addRecord')}
      </Button>
    </Form>
  )
}
