import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { QrCodeIcon, ShareIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { walletsInfiniteQueryOptions } from '@/features/home/api'
import { HomeHeader } from '@/features/home/ui/home-header'
import { HomeContent } from '@/features/home/ui/home-content'
import { getWalletsServer } from '@/features/home/api/wallet.server'
import { makeQueryClient } from '@/lib/react-query'
import { ServerFetchError } from '@/server/bff/server-fetch'

const fabMenuActionClassName =
  'bg-card text-foreground flex items-center gap-3 rounded-full px-4 py-3 shadow-lg hover:bg-muted transition-colors focus:ring-ring focus:ring-2 focus:outline-none'

function HomeFabNavActions() {
  return (
    <>
      <Link href="/share" className={fabMenuActionClassName}>
        <ShareIcon className="size-5" />
        <span className="text-sm font-medium whitespace-nowrap">
          내 명함 공유
        </span>
      </Link>
      <Link href="/scan" className={fabMenuActionClassName}>
        <QrCodeIcon className="size-5" />
        <span className="text-sm font-medium whitespace-nowrap">
          QR 코드 스캔
        </span>
      </Link>
    </>
  )
}

function HomeContentFallback() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-10">
      <p className="text-muted-foreground">명함 목록을 불러오는 중...</p>
    </div>
  )
}

async function HomeContentSection() {
  const queryClient = makeQueryClient()
  let dehydratedState

  try {
    await queryClient.prefetchInfiniteQuery(
      walletsInfiniteQueryOptions({}, getWalletsServer)
    )
    dehydratedState = dehydrate(queryClient)
  } catch (error) {
    if (error instanceof ServerFetchError && error.status === 401) {
      redirect('/auth/session-expired?next=/home')
    }
  }

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeContent fabNavActions={<HomeFabNavActions />} />
    </HydrationBoundary>
  )
}

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <HomeHeader />
      <Suspense fallback={<HomeContentFallback />}>
        <HomeContentSection />
      </Suspense>
    </div>
  )
}
