'use client'

import { Suspense } from 'react'
import { InvitationPage } from '@/features/invitation'

function InvitationPageContent() {
  return <InvitationPage />
}

export default function InvitationRoute() {
  return (
    <Suspense
      fallback={
        <div className="bg-background flex min-h-screen items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-[#022840] border-t-transparent" />
        </div>
      }
    >
      <InvitationPageContent />
    </Suspense>
  )
}
