import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { UserCircle } from 'lucide-react'
import { Button } from '@/components/Button/Button'
import { env } from '@/config/env'
import { useIdentityPhotoData } from '@/hooks/data/useIdentityPhotoData'
import type {
  AccessRole,
  EmployeeProfile,
  IdentitySection,
  ProfileSectionData,
} from '@/types/employee-profile'
import { isSectionData } from '../../profile-sections'

interface ProfileHeaderProps {
  profile: EmployeeProfile
  audienceRole: AccessRole
}

const isIdentityData = (
  section: EmployeeProfile['sections']['S1'],
): section is ProfileSectionData<IdentitySection> =>
  Boolean(section && isSectionData<IdentitySection>(section))

const buildPhotoSrc = (photoUrl: string) =>
  photoUrl.startsWith('http') ? photoUrl : `${env.api.baseUrl}${photoUrl}`

export const ProfileHeader = ({ profile, audienceRole }: ProfileHeaderProps) => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoCacheKey, setPhotoCacheKey] = useState(0)
  const { uploadPhoto, isUploadingPhoto } = useIdentityPhotoData(profile.employeeId)
  const s1 = profile.sections.S1
  const canUploadPhoto = audienceRole === 'Self'

  if (!isIdentityData(s1)) {
    return null
  }

  const segments = [
    s1.data.manager
      ? {
          key: 'manager',
          label: t('employeeProfile.header.manager'),
          relation: s1.data.manager,
        }
      : null,
    s1.data.peoplePartner
      ? {
          key: 'peoplePartner',
          label: t('employeeProfile.header.peoplePartner'),
          relation: s1.data.peoplePartner,
        }
      : null,
    s1.data.mentor
      ? {
          key: 'mentor',
          label: t('employeeProfile.header.mentor'),
          relation: s1.data.mentor,
        }
      : null,
  ].filter((segment): segment is NonNullable<typeof segment> => segment !== null)

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) {
      return
    }
    await uploadPhoto(file)
    setPhotoCacheKey(Date.now())
  }

  return (
    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex items-center gap-3">
        {s1.data.photoUrl ? (
          <img
            src={`${buildPhotoSrc(s1.data.photoUrl)}${photoCacheKey ? `?v=${photoCacheKey}` : ''}`}
            alt={t('employeeProfile.header.photoAlt', {
              name: profile.displayName,
            })}
            className="h-16 w-16 rounded-full border border-border object-cover"
            data-testid="profile-header-photo"
          />
        ) : (
          <UserCircle
            className="h-16 w-16 text-muted-foreground"
            aria-hidden="true"
            data-testid="profile-header-photo-placeholder"
          />
        )}

        {canUploadPhoto && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              className="hidden"
              data-testid="profile-photo-upload-input"
              onChange={(event) => {
                void handlePhotoChange(event)
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploadingPhoto
                ? t('employeeProfile.header.photoUpload.uploading')
                : t('employeeProfile.header.photoUpload.action')}
            </Button>
          </>
        )}
      </div>

      {segments.length > 0 && (
        <p
          className="text-sm text-muted-foreground"
          data-testid="profile-header-relationships"
        >
          {segments.map((segment, index) => (
            <span key={segment.key}>
              {index > 0 && <span aria-hidden="true"> · </span>}
              <span>
                {segment.label}:{' '}
                <Link
                  to={`/employees/${segment.relation.id}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {segment.relation.displayName}
                </Link>
              </span>
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
