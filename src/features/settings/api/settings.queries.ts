'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from '@/shared'
import { logout, deleteAccount } from './settings.api'

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      toast.success('로그아웃 되었습니다.')
      router.replace('/login')
    },
    onError: () => {
      toast.error('로그아웃에 실패했습니다.')
    },
  })
}

export function useDeleteAccount() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear()
      toast.success('회원탈퇴가 완료되었습니다.')
      router.replace('/login')
    },
    onError: () => {
      toast.error('회원탈퇴에 실패했습니다.')
    },
  })
}
