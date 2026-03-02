'use client'

import { Suspense } from 'react'
import { OcrResultPage } from '@/features/ocr'

function OcrResultPageContent() {
  return <OcrResultPage />
}

export default function OcrResultRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-[#022840] border-t-transparent" />
        </div>
      }
    >
      <OcrResultPageContent />
    </Suspense>
  )
}
