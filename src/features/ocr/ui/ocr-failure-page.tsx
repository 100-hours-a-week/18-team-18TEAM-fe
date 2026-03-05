'use client'

import { useRouter } from 'next/navigation'
import { QrScanFailure } from '@/features/qr-scan'

function OcrFailurePage() {
  const router = useRouter()

  return (
    <QrScanFailure
      title="Oops...."
      descriptionLines={[
        '명함 OCR 인식에 실패했습니다.',
        '다시 촬영해서 시도해 주세요.',
      ]}
      retryLabel="다시 촬영하기"
      retryButtonVariant="outline"
      onRetry={() => router.replace('/ocr')}
    />
  )
}

export { OcrFailurePage }
