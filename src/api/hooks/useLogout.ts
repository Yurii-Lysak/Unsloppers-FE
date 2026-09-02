import { useMutation } from '@tanstack/react-query'
import { authApiService } from '@/api/services/auth.service'

export const useLogout = () =>
  useMutation({
    mutationFn: authApiService.logout,
  })
