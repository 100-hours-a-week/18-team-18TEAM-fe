"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: "sm" | "default" | "lg"
  className?: string
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "default",
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null)

  const sizeClasses = {
    sm: "size-4",
    default: "size-6",
    lg: "size-8",
  }

  const displayValue = hoverValue ?? value

  return (
    <div
      data-slot="star-rating"
      className={cn("flex gap-1", className)}
      onMouseLeave={() => !readonly && setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
          aria-label={`${star}점`}
        >
          <StarIcon
            className={cn(
              sizeClasses[size],
              star <= displayValue
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  )
}

export { StarRating }
export type { StarRatingProps }
