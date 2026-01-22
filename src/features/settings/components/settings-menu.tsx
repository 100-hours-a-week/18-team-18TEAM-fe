"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsMenuItem {
  id: string
  label: string
  onClick?: () => void
  danger?: boolean
}

interface SettingsMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SettingsMenuItem[]
}

function SettingsMenu({ items, className, ...props }: SettingsMenuProps) {
  return (
    <div
      data-slot="settings-menu"
      className={cn("divide-y divide-border rounded-lg bg-card", className)}
      {...props}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className={cn(
            "flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted",
            "first:rounded-t-lg last:rounded-b-lg",
            item.danger && "text-destructive"
          )}
        >
          <span className="text-sm font-medium">{item.label}</span>
          <ChevronRightIcon className="size-4 text-muted-foreground" />
        </button>
      ))}
    </div>
  )
}

export { SettingsMenu }
export type { SettingsMenuProps, SettingsMenuItem }
