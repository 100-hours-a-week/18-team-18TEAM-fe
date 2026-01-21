"use client"

import * as React from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, IconButton } from "@/shared"

interface BusinessCardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  cardName?: string
  department?: string
  position?: string
  phone?: string
  email?: string
  onPress?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

function BusinessCardItem({
  name,
  cardName,
  department,
  position,
  phone,
  email,
  onPress,
  onEdit,
  onDelete,
  className,
  ...props
}: BusinessCardItemProps) {
  const hasMenu = onEdit || onDelete
  const menuItems = React.useMemo(() => {
    const items = []
    if (onEdit) {
      items.push({ id: "edit", label: "수정", onClick: onEdit })
    }
    if (onDelete) {
      items.push({ id: "delete", label: "삭제", onClick: onDelete, destructive: true })
    }
    return items
  }, [onEdit, onDelete])

  return (
    <div
      data-slot="business-card-item"
      role="button"
      tabIndex={0}
      onClick={onPress}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onPress?.()
        }
      }}
      className={cn(
        "relative w-full rounded-[10px] bg-card p-4 shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-foreground">{name}</h3>
        <div className="flex items-center gap-2">
          {cardName && (
            <span className="text-sm text-muted-foreground">{cardName}</span>
          )}
          {hasMenu && (
            <DropdownMenu
              trigger={
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label="더보기"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontalIcon className="size-4" />
                </IconButton>
              }
              items={menuItems}
            />
          )}
        </div>
      </div>

      <div className="space-y-0.5 mb-4">
        {department && (
          <p className="text-sm text-muted-foreground">{department}</p>
        )}
        {position && (
          <p className="text-sm text-muted-foreground">{position}</p>
        )}
      </div>

      <div className="pt-3 border-t border-border space-y-0.5">
        {phone && (
          <p className="text-sm text-foreground">{phone}</p>
        )}
        {email && (
          <p className="text-sm text-foreground">{email}</p>
        )}
      </div>
    </div>
  )
}

export { BusinessCardItem }
export type { BusinessCardItemProps }
