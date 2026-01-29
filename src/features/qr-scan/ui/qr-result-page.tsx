'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2Icon } from 'lucide-react'
import { Header, Button } from '@/shared'
import { useSaveScannedCard } from '../api'
import { QrScanFailure } from './qr-scan-failure'
import type { ScannedCardData } from '../model'

/** 스캔된 명함 카드 컴포넌트 */
function ScannedBusinessCard({ data }: { data: ScannedCardData }) {
  return (
    <div className="relative h-[200px] w-full max-w-[366px] rounded-[10px] bg-[#022840] px-6 py-7 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      {/* 왼쪽 상단: 이름, 회사, 부서/직책 */}
      <div className="flex flex-col gap-[5px] text-white">
        <h3 className="font-pretendard text-[20px] font-semibold leading-[22px] tracking-[-0.4px]">
          {data.name}
        </h3>
        <div className="flex flex-col text-[15px] leading-[22px] tracking-[-0.3px]">
          <p className="font-pretendard font-normal">{data.company}</p>
          <p className="font-pretendard font-medium">
            {data.department} / {data.position}
          </p>
        </div>
      </div>

      {/* 오른쪽 하단: 연락처 정보 */}
      <div className="absolute right-6 bottom-7 flex flex-col text-[12px] leading-[22px] tracking-[-0.24px] text-white">
        <p className="font-pretendard font-normal">M: {data.phone_number}</p>
        <p className="font-pretendard font-normal">E: {data.email}</p>
        <p className="font-pretendard font-normal">T: {data.lined_number}</p>
      </div>
    </div>
  )
}

/** 성공 카드 컴포넌트 */
function SuccessCard({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="flex w-full max-w-[340px] flex-col items-center rounded-[25px] bg-white px-6 py-10 shadow-[4px_10px_30px_0px_rgba(87,87,87,0.25)]">
      {/* 체크 아이콘 */}
      <CheckCircle2Icon className="size-16 text-green-500" strokeWidth={1.5} />

      {/* 제목 */}
      <h2 className="text-foreground mt-6 text-[24px] font-semibold">
        인식 성공!
      </h2>

      {/* 안내 문구 */}
      <p className="text-muted-foreground mt-4 text-center text-[16px] leading-[24px]">
        명함이 성공적으로 스캔되었습니다.
        <br />
        명함 목록에 추가됩니다.
      </p>

      {/* 확인 버튼 */}
      <Button
        variant="primary"
        fullWidth
        className="mt-8 rounded-[10px] bg-[#022840] text-white hover:bg-[#022840]/90"
        onClick={onConfirm}
      >
        확인
      </Button>
    </div>
  )
}

function QrResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const uuid = searchParams.get('uuid')

  const [cardData, setCardData] = React.useState<ScannedCardData | null>(null)
  const [hasError, setHasError] = React.useState(false)

  const { mutate: saveCard, isPending } = useSaveScannedCard()

  const handleClose = () => {
    router.push('/home')
  }

  const handleConfirm = () => {
    router.push('/home')
  }

  const handleRetry = () => {
    router.push('/scan')
  }

  // uuid가 있으면 API 호출
  React.useEffect(() => {
    if (!uuid) {
      setHasError(true)
      return
    }

    saveCard(
      { uuid },
      {
        onSuccess: (response) => {
          setCardData(response.data)
        },
        onError: () => {
          setHasError(true)
        },
      }
    )
  }, [uuid, saveCard])

  // 에러 상태
  if (hasError) {
    return <QrScanFailure onRetry={handleRetry} />
  }

  // 로딩 상태
  if (isPending || !cardData) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-[#022840] border-t-transparent" />
          <p className="text-muted-foreground">명함 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <Header showClose onClose={handleClose} />

      <main className="flex flex-col items-center gap-[59px] px-5 pt-[95px]">
        {/* 명함 카드 */}
        <ScannedBusinessCard data={cardData} />

        {/* 성공 카드 */}
        <SuccessCard onConfirm={handleConfirm} />
      </main>
    </div>
  )
}

export { QrResultPage }
