'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PlusCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/shared'
import { useMyInfo } from '@/features/user'
import { useMyLatestCard, toProfileDataFromCard } from '@/features/qr-share'
import { CardView } from '@/features/card-detail/ui'
import { cn } from '@/lib/utils'

export default function MyCardPage() {
  const router = useRouter()
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

  // 실제 에러인 경우
  if (isCardError) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  // 경력이 없는 경우 - BizKit_Miss 캐릭터와 함께 안내 UI 표시
  if (!cardData) {
    const handleClose = () => {
      router.back()
    }

    const handleAddCareer = () => {
      router.push('/career/new')
    }

    return (
      <div className="bg-background flex min-h-screen flex-col">
        <Header showClose onClose={handleClose} />

        <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          <div
            className={cn(
              'flex w-full max-w-[366px] flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10'
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-base font-medium text-gray-700">
                아직 등록된 경력이 없습니다
              </p>
              <p className="text-sm text-gray-500">
                경력을 추가하면 명함을 공유할 수 있습니다
              </p>
            </div>

            <Button onClick={handleAddCareer} className="gap-2">
              <PlusCircleIcon className="size-4" />
              경력 추가하러 가기
            </Button>
          </div>
          <Image
            src="/icons/BizKit_Miss.png"
            alt="경력 없음"
            width={2048}
            height={2048}
          />
        </main>
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
