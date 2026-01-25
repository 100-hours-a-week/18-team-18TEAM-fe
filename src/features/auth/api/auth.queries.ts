import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '../model'

export function useUser() {
  return useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me')
      if (!res.ok) return null
      const data = await res.json()
      return data.user
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => fetch('/api/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      queryClient.setQueryData(['user'], null)
    },
  })
}
