"use client"

import * as React from "react"
import { toast, Toaster } from "@/shared"
import {
  StarRating,
  ReviewForm,
  ReviewBadge,
  AlreadyReviewedState,
} from "@/features/reviews/components"

export default function ReviewsPreviewPage() {
  const [rating, setRating] = React.useState(3)

  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <Toaster />
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Reviews Component Preview</h1>
        <p className="text-sm text-muted-foreground">리뷰 관련 컴포넌트를 한눈에 확인합니다.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">StarRating</h2>
        <div className="flex items-center gap-4">
          <StarRating value={rating} onChange={setRating} />
          <span className="text-sm text-muted-foreground">{rating} 점</span>
        </div>
        <div className="flex items-center gap-4">
          <StarRating value={4} readonly size="sm" />
          <StarRating value={5} readonly size="lg" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">ReviewBadge</h2>
        <div className="flex gap-3">
          <ReviewBadge rating={4} count={123} />
          <ReviewBadge rating={3.8} count={12} variant="skill" />
          <ReviewBadge variant="communication">긍정 피드백</ReviewBadge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">ReviewForm</h2>
        <div className="max-w-md">
          <ReviewForm
            onSubmit={(data) => {
              toast.success(`리뷰 제출: ${data.rating}점`)
              console.log(data)
            }}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">AlreadyReviewedState</h2>
        <AlreadyReviewedState
          rating={4.2}
          onEdit={() => toast.info("리뷰 수정")}
        />
      </section>
    </div>
  )
}
