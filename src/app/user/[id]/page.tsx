'use client'

import { useParams } from 'next/navigation'
import { useUserProfile } from '@/features/user'
import { CardView } from '@/features/card-detail/ui'

export default function UserCardPage() {
  const params = useParams()
  const userId = params.id as string

  const { data: profileData, userInfo, isLoading, isError } = useUserProfile(userId)

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (isError || !profileData) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  return (
    <CardView
      profileData={profileData}
      userInfo={userInfo}
      showMenu={false}
      isOwner={false}
    />
  )
}
