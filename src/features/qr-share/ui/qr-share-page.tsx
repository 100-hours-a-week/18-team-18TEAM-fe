'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import { Header } from '@/shared'
import { useMyLatestCard } from '../api'
import { BusinessCard } from './business-card'
import { EmptyCareerCard } from './empty-career-card'
import { LinkShareContent } from './link-share-content'
import { QrCodeCard } from './qr-code-card'

function QrSharePage() {
  const router = useRouter()
  const { data: cardData, isLoading, error } = useMyLatestCard()

  const handleClose = () => {
    router.push('/home')
  }

  // 경력 없음 상태 체크 (cardData가 null이거나 company가 비어있는 경우)
  const hasNoCareer = !cardData || !cardData.company

  const qrValue = React.useMemo(() => {
    if (!cardData?.uuid) return ''
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    return `${baseUrl}/invitation?uuid=${cardData.uuid}`
  }, [cardData?.uuid])

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">명함 정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <Header showClose onClose={handleClose} />

      <main className="flex flex-col items-center gap-[32px] px-5 pt-[95px]">
        {/* 명함 카드 또는 빈 경력 카드 */}
        {hasNoCareer ? (
          <EmptyCareerCard className="w-full max-w-[366px]" />
        ) : (
          <BusinessCard data={cardData} className="w-full max-w-[366px]" />
        )}

        {/* 공유 탭 */}
        <Tabs defaultValue="qr" className="w-full max-w-[366px]">
          <TabsList className="w-full">
            <TabsTrigger value="qr">QR 공유</TabsTrigger>
            <TabsTrigger value="link" disabled={hasNoCareer}>
              링크 공유
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr">
            <div className="flex w-full flex-col items-center gap-5 pt-4">
              {hasNoCareer ? (
                <p className="font-inter text-center text-[14px] leading-normal text-[#666]">
                  경력을 추가하면 QR 코드가 생성됩니다
                </p>
              ) : (
                <>
                  <QrCodeCard
                    value={qrValue}
                    className="w-full max-w-[340px]"
                  />
                  <p className="font-inter text-center text-[12px] leading-normal text-[#666]">
                    QR 코드를 스캔하면 누구나 회원님의 명함 정보를 확인할 수
                    있습니다.
                  </p>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="link">
            <div className="flex w-full flex-col items-center pt-4">
              <LinkShareContent shareUrl={qrValue} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export { QrSharePage }
