"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface BusinessCardListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

function BusinessCardList({
  children,
  className,
  ...props
}: BusinessCardListProps) {
  return (
    <div
      data-slot="business-card-list"
      className={cn("flex flex-col gap-3 pb-20", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { BusinessCardList }
export type { BusinessCardListProps }
