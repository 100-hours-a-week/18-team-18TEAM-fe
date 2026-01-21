"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { IconButton } from "./icon-button"

interface BottomNavItem {
  id: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  items: BottomNavItem[]
  activeId?: string
}

function BottomNav({ items, activeId, className, ...props }: BottomNavProps) {
  return (
    <nav
      data-slot="bottom-nav"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex h-[67px] items-center justify-center gap-12 bg-background/60 backdrop-blur-md border-t border-border",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 rounded-full transition-colors",
            activeId === item.id
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={item.label}
          aria-current={activeId === item.id ? "page" : undefined}
        >
          <div
            className={cn(
              "flex items-center justify-center size-[45px] rounded-full",
              activeId === item.id && "bg-surface/30"
            )}
          >
            {item.icon}
          </div>
        </button>
      ))}
    </nav>
  )
}

export { BottomNav }
export type { BottomNavProps, BottomNavItem }
