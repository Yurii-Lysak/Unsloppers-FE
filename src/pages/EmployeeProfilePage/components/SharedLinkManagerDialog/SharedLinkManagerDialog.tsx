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
  canCreate: boolean
  canManage: boolean
}

export const SharedLinkManagerDialog = ({
  employeeId,
  open,
  onClose,
  canCreate,
  canManage,
}: SharedLinkManagerDialogProps) => {
  const {
    t,
    activeTab,
    setActiveTab,
    recipientEmployeeId,
    setRecipientEmployeeId,
    selectedSections,
    toggleSection,
    shareableSections,
    expiryPresets,
    expiresInHours,
    setExpiresInHours,
    recipientOptions,
    isRecipientsLoading,
    createdUrl,
    rootError,
    isSubmitting,
    handleCreate,
    handleCopyUrl,
    handleClose,
    activeLinks,
    isLinksLoading,
    isLinksError,
    handleRevoke,
    isRevoking,
    expandedLogLinkId,
    toggleAccessLog,
    accessLogEntries,
    isAccessLogLoading,
    isAccessLogError,
  } = useSharedLinkManagerDialog({ employeeId, open, onClose, canCreate, canManage })

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
        ) : activeTab === 'create' ? (
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
        ) : (
          <Button type="button" variant="outline" onClick={handleClose}>
            {t('employeeProfile.sharedLink.close')}
          </Button>
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
          {(canCreate && canManage) && (
            <div className="flex gap-2" role="tablist">
              <Button
                type="button"
                variant={activeTab === 'create' ? 'default' : 'outline'}
                onClick={() => setActiveTab('create')}
                data-testid="shared-link-tab-create"
              >
                {t('employeeProfile.sharedLink.tabCreate')}
              </Button>
              <Button
                type="button"
                variant={activeTab === 'manage' ? 'default' : 'outline'}
                onClick={() => setActiveTab('manage')}
                data-testid="shared-link-tab-manage"
              >
                {t('employeeProfile.sharedLink.tabManage')}
              </Button>
            </div>
          )}

          {activeTab === 'create' && canCreate ? (
            <>
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

              <Select
                id="shared-link-expiry"
                label={t('employeeProfile.sharedLink.expiry.label')}
                value={String(expiresInHours)}
                onValueChange={(value) => setExpiresInHours(Number(value))}
                options={expiryPresets.map((preset) => ({
                  value: String(preset.hours),
                  label: t(preset.labelKey),
                }))}
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
            </>
          ) : canManage ? (
            <div className="space-y-3" data-testid="shared-link-manage-panel">
              {isLinksLoading ? (
                <p className="text-sm text-muted-foreground">
                  {t('employeeProfile.loading')}
                </p>
              ) : isLinksError ? (
                <p className="text-sm text-destructive" role="alert">
                  {t('employeeProfile.sharedLink.manageLoadFailed')}
                </p>
              ) : activeLinks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t('employeeProfile.sharedLink.noActiveLinks')}
                </p>
              ) : (
                <ul className="space-y-3">
                  {activeLinks.map((link) => (
                    <li
                      key={link.id}
                      className="rounded-md border border-border p-3"
                      data-testid={`shared-link-row-${link.id}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-foreground">
                            {link.recipient.displayName}
                          </p>
                          <p className="text-muted-foreground">
                            {t('employeeProfile.sharedLink.expiresAt', {
                              date: new Date(link.expiresAt).toLocaleString(),
                            })}
                          </p>
                          <p className="text-muted-foreground">
                            {t('employeeProfile.sharedLink.sectionsSummary', {
                              sections: link.sectionIds
                                .map((sectionId) => sectionLabel(t, sectionId))
                                .join(', '),
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAccessLog(link.id)}
                          >
                            {expandedLogLinkId === link.id
                              ? t('employeeProfile.sharedLink.hideLog')
                              : t('employeeProfile.sharedLink.viewLog')}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isRevoking}
                            onClick={() => void handleRevoke(link.id)}
                          >
                            {t('employeeProfile.sharedLink.revoke')}
                          </Button>
                        </div>
                      </div>
                      {expandedLogLinkId === link.id && (
                        <div className="mt-3 border-t border-border pt-3">
                          {isAccessLogLoading ? (
                            <p className="text-sm text-muted-foreground">
                              {t('employeeProfile.loading')}
                            </p>
                          ) : isAccessLogError ? (
                            <p className="text-sm text-destructive" role="alert">
                              {t('employeeProfile.sharedLink.logLoadFailed')}
                            </p>
                          ) : accessLogEntries.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              {t('employeeProfile.sharedLink.emptyLog')}
                            </p>
                          ) : (
                            <ul className="space-y-2 text-sm">
                              {accessLogEntries.map((entry, index) => (
                                <li
                                  key={`${entry.accessedAt}-${entry.outcome}-${index}`}
                                  className="text-muted-foreground"
                                >
                                  {t('employeeProfile.sharedLink.logEntry', {
                                    time: new Date(entry.accessedAt).toLocaleString(),
                                    outcome: t(
                                      `employeeProfile.sharedLink.outcomes.${entry.outcome}`,
                                    ),
                                    reason: entry.denialReason
                                      ? t(
                                          `employeeProfile.sharedLink.denialReasons.${entry.denialReason}`,
                                        )
                                      : t('employeeProfile.sharedLink.noDenialReason'),
                                  })}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}

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
