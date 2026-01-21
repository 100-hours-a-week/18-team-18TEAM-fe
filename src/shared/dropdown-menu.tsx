"use client"

import * as React from "react"
import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  destructive?: boolean
  disabled?: boolean
}

interface MenuGroup {
  label?: string
  items: MenuItem[]
}

interface DropdownMenuProps {
  trigger: React.ReactNode
  items?: MenuItem[]
  groups?: MenuGroup[]
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
}

function DropdownMenu({
  trigger,
  items,
  groups,
  align = "end",
  side = "bottom",
}: DropdownMenuProps) {
  const renderItems = (menuItems: MenuItem[]) =>
    menuItems.map((item) => (
      <DropdownMenuItem
        key={item.id}
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn(item.destructive && "text-destructive focus:text-destructive")}
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}
        {item.label}
      </DropdownMenuItem>
    ))

  return (
    <ShadcnDropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side}>
        {items && renderItems(items)}
        {groups &&
          groups.map((group, index) => (
            <React.Fragment key={group.label || index}>
              {index > 0 && <DropdownMenuSeparator />}
              {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
              {renderItems(group.items)}
            </React.Fragment>
          ))}
      </DropdownMenuContent>
    </ShadcnDropdownMenu>
  )
}

export { DropdownMenu }
export type { DropdownMenuProps, MenuItem, MenuGroup }
