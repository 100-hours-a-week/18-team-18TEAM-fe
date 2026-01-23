'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SkillBarData {
  label: string
  value: number // 0-100
}

interface SkillBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SkillBarData[]
  onBarClick?: (item: SkillBarData) => void
}

function SkillBarChart({
  data,
  onBarClick,
  className,
  ...props
}: SkillBarChartProps) {
  return (
    <div
      data-slot="skill-bar-chart"
      className={cn('space-y-4', className)}
      {...props}
    >
      {data.map((item, index) => (
        <div
          key={index}
          className={cn('space-y-2', onBarClick && 'cursor-pointer')}
          onClick={() => onBarClick?.(item)}
        >
          <div className="flex items-center justify-between">
            <span className="text-foreground text-sm font-medium">
              {item.label}
            </span>
            <span className="text-muted-foreground text-sm">{item.value}%</span>
          </div>
          <div className="bg-muted h-4 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export { SkillBarChart }
export type { SkillBarChartProps, SkillBarData }
