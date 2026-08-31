import { useMutation } from '@tanstack/react-query'
import { loginApiCall } from '@/api/auth'

export const useLogin = () =>
  useMutation({
    mutationFn: loginApiCall,
  })
