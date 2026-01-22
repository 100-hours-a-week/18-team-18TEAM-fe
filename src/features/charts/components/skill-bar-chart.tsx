"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SkillBarData {
  label: string
  value: number // 0-100
}

interface SkillBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SkillBarData[]
  onBarClick?: (item: SkillBarData) => void
}

function SkillBarChart({ data, onBarClick, className, ...props }: SkillBarChartProps) {
  return (
    <div
      data-slot="skill-bar-chart"
      className={cn("space-y-4", className)}
      {...props}
    >
      {data.map((item, index) => (
        <div
          key={index}
          className={cn("space-y-2", onBarClick && "cursor-pointer")}
          onClick={() => onBarClick?.(item)}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">
              {item.label}
            </span>
            <span className="text-sm text-muted-foreground">{item.value}%</span>
          </div>
          <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
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
