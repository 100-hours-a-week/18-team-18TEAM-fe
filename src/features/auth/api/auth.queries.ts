import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { User } from '../model'

export function useUser() {
  return useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/auth/me')
        return res.data
      } catch {
        return null
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}
