'use client'

import { useMyInfo } from '@/features/user'
import { useMyLatestCard, toProfileDataFromCard } from '@/features/qr-share'
import { CardView } from '@/features/card-detail/ui'

export default function MyCardPage() {
  const {
    data: cardData,
    isLoading: isCardLoading,
    isError: isCardError,
  } = useMyLatestCard()
  const { data: userInfo, isLoading: isUserLoading } = useMyInfo()

  const isLoading = isCardLoading || isUserLoading

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (isCardError || !cardData) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  const profileData = toProfileDataFromCard(
    cardData,
    userInfo?.profile_image_url
  )

  return (
    <CardView
      profileData={profileData}
      userInfo={{ description: cardData.description } as any}
      showMenu={true}
      isOwner={true}
    />
  )
}
