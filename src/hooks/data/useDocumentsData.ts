import { useUploadDocument } from '@/api/hooks/useDocuments'
import type { DocumentType } from '@/types/employee-profile'

export const useDocumentsData = (employeeId: string) => {
  const uploadDocumentMutation = useUploadDocument(employeeId)

  const uploadDocument = async (type: DocumentType, file: File) => {
    await uploadDocumentMutation.mutateAsync({ type, file })
  }

  return {
    uploadDocument,
    isUploadingDocument: uploadDocumentMutation.isPending,
  }
}
