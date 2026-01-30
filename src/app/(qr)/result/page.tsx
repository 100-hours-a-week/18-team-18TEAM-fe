'use client'

import { Suspense } from 'react'
import { QrResultPage } from '@/features/qr-scan'

function ResultPageContent() {
  return <QrResultPage />
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-[#022840] border-t-transparent" />
        </div>
      }
    >
      <ResultPageContent />
    </Suspense>
  )
}
