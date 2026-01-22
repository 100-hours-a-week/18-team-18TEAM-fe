"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { InfoCard } from "@/shared"

interface ActivityItem {
  id: string
  title: string
  period?: string
  description?: string
}

interface ActivitiesListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ActivityItem[]
  editable?: boolean
  onEdit?: (id: string) => void
}

function ActivitiesList({
  items,
  editable = false,
  onEdit,
  className,
  ...props
}: ActivitiesListProps) {
  if (items.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        등록된 활동이 없습니다.
      </div>
    )
  }

  return (
    <div
      data-slot="activities-list"
      className={cn("space-y-3", className)}
      {...props}
    >
      {items.map((item) => (
        <InfoCard
          key={item.id}
          title={item.title}
          editable={editable}
          onEdit={() => onEdit?.(item.id)}
        >
          <div className="space-y-1">
            {item.period && (
              <p className="text-muted-foreground text-xs">{item.period}</p>
            )}
            {item.description && (
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            )}
          </div>
        </InfoCard>
      ))}
    </div>
  )
}

export { ActivitiesList }
export type { ActivitiesListProps, ActivityItem }
