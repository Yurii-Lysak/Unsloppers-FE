import { useMutation } from '@tanstack/react-query'
import { logoutApiCall } from '@/api/auth'

export const useLogout = () =>
  useMutation({
    mutationFn: logoutApiCall,
  })
