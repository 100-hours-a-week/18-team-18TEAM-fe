"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { StarRating } from "./star-rating"
import { TagButton } from "./tag-button"

interface ReviewFormData {
  rating: number
  content: string
  tags: string[]
}

interface ReviewFormProps extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onSubmit: (data: ReviewFormData) => void
  isLoading?: boolean
}

function ReviewForm({
  onSubmit,
  isLoading = false,
  className,
  ...props
}: ReviewFormProps) {
  const [rating, setRating] = React.useState(0)
  const [content, setContent] = React.useState("")
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])

  const tagOptions = [
    "협업을 잘한다.",
    "말을 잘한다.",
    "문서화를 잘한다.",
    "기술 역량이 뛰어나다.",
    "일정을 잘 지킨다.",
    "다음에 같이 일하고 싶지 않다.",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return
    onSubmit({ rating, content, tags: selectedTags })
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <form
      data-slot="review-form"
      onSubmit={handleSubmit}
      className={cn("space-y-6", className)}
      {...props}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">평점</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">태그 선택</p>
        <div className="grid grid-cols-2 gap-2">
          {tagOptions.map((tag) => (
            <TagButton
              key={tag}
              selected={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </TagButton>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="review-content"
          className="text-sm font-medium text-foreground"
        >
          리뷰 내용
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰를 작성해주세요"
          rows={4}
          className={cn(
            "w-full px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "resize-none"
          )}
        />
      </div>

      <Button
        type="submit"
        disabled={rating === 0 || isLoading}
        className="w-full"
      >
        {isLoading ? "제출 중..." : "리뷰 작성"}
      </Button>
    </form>
  )
}

export { ReviewForm }
export type { ReviewFormProps, ReviewFormData }
