import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userKeys } from '@/features/user/api/user.queries'
import type { ProfileFormData } from '../model'
import { updateProfile } from './profile.api'

/** 프로필 수정 mutation 훅 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProfileFormData) => updateProfile(data),
    onSuccess: () => {
      // 내 정보 쿼리 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}
