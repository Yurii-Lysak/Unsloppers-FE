import { useMentorshipData } from '@/hooks/data/useMentorshipData'
import type { SectionAccessLevel } from '@/types/employee-profile'

export const useMentorshipSection = (
  employeeId: string,
  accessLevel: Exclude<SectionAccessLevel, 'none'>,
  canEditFlag: boolean,
) => {
  const { patchOpenToMentoring, isPatchingOpenToMentoring } =
    useMentorshipData(employeeId)

  const toggleOpenToMentoring = async (checked: boolean) => {
    if (!canEditFlag || accessLevel !== 'RW') {
      return
    }
    await patchOpenToMentoring({ openToMentoring: checked })
  }

  return {
    toggleOpenToMentoring,
    isPatchingOpenToMentoring,
  }
}
