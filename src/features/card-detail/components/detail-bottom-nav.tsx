"use client"

import * as React from "react"
import { UserIcon, HexagonIcon, StarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type NavTab = "user-detail" | "charts" | "reviews"

interface DetailBottomNavProps extends React.HTMLAttributes<HTMLElement> {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
}

function DetailBottomNav({
  activeTab,
  onTabChange,
  className,
  ...props
}: DetailBottomNavProps) {
  const tabs: { id: NavTab; icon: React.ReactNode; label: string }[] = [
    {
      id: "user-detail",
      icon: <UserIcon className="size-5" />,
      label: "상세 정보",
    },
    {
      id: "charts",
      icon: <HexagonIcon className="size-5" />,
      label: "역량 차트",
    },
    {
      id: "reviews",
      icon: <StarIcon className="size-5" />,
      label: "리뷰",
    },
  ]

  return (
    <nav
      data-slot="detail-bottom-nav"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex h-[67px] items-center justify-center gap-12 bg-background/60 backdrop-blur-md",
        className
      )}
      {...props}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 rounded-full transition-colors",
            activeTab === tab.id
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-label={tab.label}
          aria-current={activeTab === tab.id ? "page" : undefined}
        >
          <div
            className={cn(
              "flex items-center justify-center size-[45px] rounded-full transition-colors",
              activeTab === tab.id && "bg-surface/30"
            )}
          >
            {tab.icon}
          </div>
        </button>
      ))}
    </nav>
  )
}

export { DetailBottomNav }
export type { DetailBottomNavProps, NavTab }
