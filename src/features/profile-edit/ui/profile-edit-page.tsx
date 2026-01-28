'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/shared'
import { ProfileEditForm } from './profile-edit-form'

function ProfileEditPage() {
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }

  return (
    <div className="bg-background flex min-h-screen flex-col pt-14">
      <Header showClose onClose={handleClose} title="프로필 수정" />
      <ProfileEditForm />
    </div>
  )
}

export { ProfileEditPage }
