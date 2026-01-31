'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

interface BusinessCardListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hasNext?: boolean
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
}

function BusinessCardList({
  children,
  hasNext = false,
  fetchNextPage,
  isFetchingNextPage,
  className,
  ...props
}: BusinessCardListProps) {
  const { ref, inView } = useInView({ rootMargin: '200px' })

  useEffect(() => {
    if (inView && hasNext && !isFetchingNextPage) {
      fetchNextPage?.()
    }
  }, [inView, hasNext, isFetchingNextPage, fetchNextPage])

  return (
    <div
      data-slot="business-card-list"
      className={cn('flex flex-col gap-[15px] pb-20', className)}
      {...props}
    >
      {children}
      {hasNext && (
        <div ref={ref} className="h-4 w-full" aria-hidden>
          {isFetchingNextPage && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              명함을 가져오고 있어요...
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { BusinessCardList }
export type { BusinessCardListProps }
