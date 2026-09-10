import { useUploadIdentityPhoto } from '@/api/hooks/useIdentityPhoto'

export const useIdentityPhotoData = (employeeId: string) => {
  const uploadPhotoMutation = useUploadIdentityPhoto(employeeId)

  const uploadPhoto = async (file: File) => {
    await uploadPhotoMutation.mutateAsync(file)
  }

  return {
    uploadPhoto,
    isUploadingPhoto: uploadPhotoMutation.isPending,
  }
}
