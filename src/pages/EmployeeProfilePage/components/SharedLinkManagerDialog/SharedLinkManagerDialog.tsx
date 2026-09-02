import { Button } from '@/components/Button/Button'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Modal } from '@/components/Modal/Modal'
import { Select } from '@/components/Select/Select'
import type { SectionId } from '@/types/employee-profile'
import { useSharedLinkManagerDialog } from './hooks/useSharedLinkManagerDialog'

interface SharedLinkManagerDialogProps {
  employeeId: string
  open: boolean
  onClose: () => void
}

export const SharedLinkManagerDialog = ({
  employeeId,
  open,
  onClose,
}: SharedLinkManagerDialogProps) => {
  const {
    t,
    recipientEmployeeId,
    setRecipientEmployeeId,
    selectedSections,
    toggleSection,
    shareableSections,
    recipientOptions,
    isRecipientsLoading,
    createdUrl,
    rootError,
    isSubmitting,
    handleCreate,
    handleCopyUrl,
    handleClose,
  } = useSharedLinkManagerDialog({ employeeId, open, onClose })

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t('employeeProfile.sharedLink.title')}
      footer={
        createdUrl ? (
          <>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('employeeProfile.sharedLink.close')}
            </Button>
            <Button type="button" onClick={() => void handleCopyUrl()}>
              {t('employeeProfile.sharedLink.copyUrl')}
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('employeeProfile.sharedLink.cancel')}
            </Button>
            <Button
              type="button"
              onClick={() => void handleCreate()}
              disabled={isSubmitting || isRecipientsLoading}
            >
              {isSubmitting
                ? t('employeeProfile.sharedLink.creating')
                : t('employeeProfile.sharedLink.create')}
            </Button>
          </>
        )
      }
    >
      {createdUrl ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t('employeeProfile.sharedLink.createdHint')}
          </p>
          <p
            className="break-all rounded-md border border-border bg-muted/40 p-2 text-sm"
            data-testid="shared-link-created-url"
          >
            {createdUrl}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t('employeeProfile.sharedLink.s1DefaultHint')}
          </p>

          <Select
            id="shared-link-recipient"
            label={t('employeeProfile.sharedLink.recipient')}
            value={recipientEmployeeId}
            onValueChange={setRecipientEmployeeId}
            placeholder={t('employeeProfile.sharedLink.recipientPlaceholder')}
            disabled={isRecipientsLoading}
            options={recipientOptions}
          />

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">
              {t('employeeProfile.sharedLink.sections')}
            </legend>
            {shareableSections.map((sectionId) => (
              <Checkbox
                key={sectionId}
                id={`shared-link-section-${sectionId}`}
                label={sectionLabel(t, sectionId)}
                checked={selectedSections.includes(sectionId)}
                onCheckedChange={() => toggleSection(sectionId)}
              />
            ))}
          </fieldset>

          {rootError && (
            <p className="text-sm text-destructive" role="alert">
              {rootError}
            </p>
          )}
        </div>
      )}
    </Modal>
  )
}

const sectionLabel = (
  t: (key: string, options?: { id: string }) => string,
  sectionId: SectionId,
): string => {
  const knownKeys: Partial<Record<SectionId, string>> = {
    S2: 'employeeProfile.sharedLink.sectionLabels.S2',
    S4: 'employeeProfile.sharedLink.sectionLabels.S4',
    S5: 'employeeProfile.sharedLink.sectionLabels.S5',
    S6: 'employeeProfile.sharedLink.sectionLabels.S6',
    S8: 'employeeProfile.sharedLink.sectionLabels.S8',
    S9: 'employeeProfile.sections.timeline',
    S10: 'employeeProfile.sections.leaves',
    S11: 'employeeProfile.sections.projects',
    S12: 'employeeProfile.sharedLink.sectionLabels.S12',
    S15: 'employeeProfile.sharedLink.sectionLabels.S15',
    S16: 'employeeProfile.sections.customFields',
  }
  const key = knownKeys[sectionId]
  return key ? t(key) : t('employeeProfile.sections.generic', { id: sectionId })
}
