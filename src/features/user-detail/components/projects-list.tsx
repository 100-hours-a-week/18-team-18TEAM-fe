"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { InfoCard } from "@/shared"

interface ProjectItem {
  id: string
  name: string
  period: string
  description?: string
}

interface ProjectsListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ProjectItem[]
  editable?: boolean
  onEdit?: (id: string) => void
}

function ProjectsList({
  items,
  editable = false,
  onEdit,
  className,
  ...props
}: ProjectsListProps) {
  if (items.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        등록된 프로젝트가 없습니다.
      </div>
    )
  }

  return (
    <div
      data-slot="projects-list"
      className={cn("space-y-3", className)}
      {...props}
    >
      {items.map((item) => (
        <InfoCard
          key={item.id}
          title={item.name}
          editable={editable}
          onEdit={() => onEdit?.(item.id)}
        >
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">{item.period}</p>
            {item.description && (
              <p className="mt-2 text-muted-foreground line-clamp-4">
                {item.description}
              </p>
            )}
          </div>
        </InfoCard>
      ))}
    </div>
  )
}

export { ProjectsList }
export type { ProjectsListProps, ProjectItem }
