import { useState } from 'react'
import { useCompleteActionItem } from '@/api/hooks/useActionItemMutations'

export const useActionItemsData = (employeeId: string) => {
  const completeMutation = useCompleteActionItem(employeeId)
  const [pendingItemId, setPendingItemId] = useState<string | null>(null)

  const completeItem = async (itemId: string) => {
    setPendingItemId(itemId)
    try {
      await completeMutation.mutateAsync(itemId)
    } catch {
      // onError in useCompleteActionItem handles toast and cache invalidation
    } finally {
      setPendingItemId(null)
    }
  }

  return {
    completeItem,
    pendingItemId,
  }
}
