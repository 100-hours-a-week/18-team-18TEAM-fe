'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { StarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const reviewBadgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        collaboration: 'bg-chart-1/20 text-chart-1',
        communication: 'bg-chart-2/20 text-chart-2',
        skill: 'bg-chart-3/20 text-chart-3',
        documentation: 'bg-chart-4/20 text-chart-4',
        trust: 'bg-chart-5/20 text-chart-5',
        preference: 'bg-chart-6/20 text-chart-6',
      },
    },
    defaultVariants: {
      variant: 'collaboration',
    },
  }
)

interface ReviewBadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof reviewBadgeVariants> {
  rating?: number
  count?: number
  children?: React.ReactNode
}

function ReviewBadge({
  variant,
  rating,
  count,
  children,
  className,
  ...props
}: ReviewBadgeProps) {
  const text =
    children ??
    (typeof rating === 'number'
      ? `${rating.toFixed(1)}${typeof count === 'number' ? ` · ${count}` : ''}`
      : undefined)

  return (
    <span
      data-slot="review-badge"
      className={cn(reviewBadgeVariants({ variant, className }))}
      {...props}
    >
      {typeof rating === 'number' && (
        <StarIcon className="mr-1 size-3 fill-current text-current" />
      )}
      {text}
    </span>
  )
}

export { ReviewBadge, reviewBadgeVariants }
export type { ReviewBadgeProps }
