import { useActionItemsData } from '@/hooks/data/useActionItemsData'

export const useActionItemsSection = (employeeId: string) => {
  const { completeItem, pendingItemId } = useActionItemsData(employeeId)

  return {
    completeItem,
    pendingItemId,
  }
}
