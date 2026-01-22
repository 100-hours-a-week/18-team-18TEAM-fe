"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { InfoCard } from "@/shared"

interface SkillsListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: string[]
  editable?: boolean
  onEdit?: (skill: string) => void
}

function SkillsList({
  items,
  editable = false,
  onEdit,
  className,
  ...props
}: SkillsListProps) {
  if (items.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        등록된 기술이 없습니다.
      </div>
    )
  }

  return (
    <div
      data-slot="skills-list"
      className={cn("space-y-3", className)}
      {...props}
    >
      {items.map((item) => (
        <InfoCard
          key={item}
          title={item}
          editable={editable}
          onEdit={() => onEdit?.(item)}
        />
      ))}
    </div>
  )
}

export { SkillsList }
export type { SkillsListProps }
