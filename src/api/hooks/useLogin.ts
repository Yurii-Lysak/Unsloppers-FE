import { useMutation } from '@tanstack/react-query'
import { authApiService } from '@/api/services/auth.service'

export const useLogin = () =>
  useMutation({
    mutationFn: authApiService.login,
  })
