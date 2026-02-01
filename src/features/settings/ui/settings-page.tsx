'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header, Button, AlertDialog } from '@/shared'
import { useLogout, useDeleteAccount } from '../api'

export function SettingsPage() {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const logout = useLogout()
  const deleteAccount = useDeleteAccount()

  const handleClose = () => {
    router.back()
  }

  return (
    <div className="flex min-h-screen flex-col pt-14">
      <Header title="설정" showClose onClose={handleClose} />

      <div className="flex flex-col gap-4 p-6">
        <Button
          variant="outline"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          {logout.isPending ? '로그아웃 중...' : '로그아웃'}
        </Button>

        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          회원탈퇴
        </Button>
      </div>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="정말 탈퇴하시겠습니까?"
        description="모든 데이터가 삭제되며 복구할 수 없습니다."
        type="destructive"
        confirmText="탈퇴"
        cancelText="취소"
        onConfirm={() => deleteAccount.mutate()}
        loading={deleteAccount.isPending}
      />
    </div>
  )
}
