'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/shared'
import { useMyLatestCard } from '../api'
import { BusinessCard } from './business-card'
import { QrCodeCard } from './qr-code-card'

function QrSharePage() {
  const router = useRouter()
  const { data: cardData, isLoading, error } = useMyLatestCard()

  const handleClose = () => {
    router.push('/home')
  }

  const qrValue = React.useMemo(() => {
    if (!cardData?.uuid) return ''
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    return `${baseUrl}/result?uuid=${cardData.uuid}`
  }, [cardData?.uuid])

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (error || !cardData) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">명함 정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <Header showClose onClose={handleClose} />

      <main className="flex flex-col items-center gap-[59px] px-5 pt-[95px]">
        {/* 명함 카드 */}
        <BusinessCard data={cardData} className="w-full max-w-[366px]" />

        {/* QR 코드 섹션 */}
        <div className="flex w-full max-w-[349px] flex-col items-center gap-5">
          <QrCodeCard value={qrValue} className="w-full max-w-[340px]" />
          <p className="font-inter text-center text-[12px] leading-normal text-[#666]">
            QR 코드를 스캔하면 누구나 회원님의 명함 정보를 확인할 수 있습니다.
          </p>
        </div>
      </main>
    </div>
  )
}

export { QrSharePage }
