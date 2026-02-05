import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userKeys } from '@/features/user/api/user.queries'
import { updateProfileImage } from './profile.api'

/** 프로필 이미지 수정 mutation 훅 */
export function useUpdateProfileImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profileImageKey: string | null) =>
      updateProfileImage(profileImageKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}
