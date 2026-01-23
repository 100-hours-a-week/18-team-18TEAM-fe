'use client'

import * as React from 'react'
import { CheckCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StarRating } from './star-rating'

interface AlreadyReviewedStateProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number
  reviewDate?: string
  onEdit?: () => void
}

function AlreadyReviewedState({
  rating,
  reviewDate,
  className,
  ...props
}: AlreadyReviewedStateProps) {
  return (
    <div
      data-slot="already-reviewed-state"
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
      {...props}
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <CheckCircleIcon className="size-8" />
      </div>

      <h3 className="text-foreground mb-2 text-lg font-semibold">
        이미 리뷰를 작성했습니다
      </h3>

      <p className="text-muted-foreground mb-4 text-sm">
        리뷰를 수정하려면 관리자에게 문의하세요.
      </p>

      <div className="flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-sm">내 평점</span>
        <StarRating value={rating} readonly size="default" />
      </div>

      {reviewDate && (
        <p className="text-muted-foreground mt-4 text-xs">
          작성일: {reviewDate}
        </p>
      )}
    </div>
  )
}

export { AlreadyReviewedState }
export type { AlreadyReviewedStateProps }
