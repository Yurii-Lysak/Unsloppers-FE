import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import { env } from '@/config/env'
import { useDocumentsData } from '@/hooks/data/useDocumentsData'
import type {
  AccessRole,
  DocumentsSection as DocumentsSectionData,
  ProfileSectionEnvelope,
  SectionAccessLevel,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'

interface DocumentsSectionCardProps {
  employeeId: string
  section: ProfileSectionEnvelope<DocumentsSectionData>
  accessLevel: Exclude<SectionAccessLevel, 'none'>
  audienceRole: AccessRole
}

const buildDownloadHref = (downloadUrl: string) =>
  downloadUrl.startsWith('http')
    ? downloadUrl
    : `${env.api.baseUrl}${downloadUrl}`

export const DocumentsSectionCard = ({
  employeeId,
  section,
  audienceRole,
}: DocumentsSectionCardProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadDocument, isUploadingDocument } = useDocumentsData(employeeId)
  const canUpload = audienceRole === 'Self'

  if (!isSectionData<DocumentsSectionData>(section)) {
    return null
  }

  const { documents } = section.data

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }
    await uploadDocument('CERTIFICATE', file)
  }

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t('employeeProfile.sections.documents.empty')}
        </p>
      ) : (
        <ul className="space-y-2 text-sm">
          {documents.map((document) => (
            <li key={document.id}>
              <a
                href={buildDownloadHref(document.downloadUrl)}
                className="text-foreground underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {document.originalFilename}
              </a>
            </li>
          ))}
        </ul>
      )}

      {canUpload && (
        <div className="border-t border-border pt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="hidden"
            data-testid="documents-upload-input"
            onChange={(event) => {
              void handleFileChange(event)
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploadingDocument}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploadingDocument
              ? t('employeeProfile.sections.documents.upload.uploading')
              : t('employeeProfile.sections.documents.upload.action')}
          </Button>
        </div>
      )}
    </div>
  )
}
