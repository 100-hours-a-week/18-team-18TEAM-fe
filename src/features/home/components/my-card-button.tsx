"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/shared"

interface MyCardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  avatarSrc?: string | null
}

function MyCardButton({
  avatarSrc,
  className,
  ...props
}: MyCardButtonProps) {
  return (
    <button
      type="button"
      data-slot="my-card-button"
      className={cn(
        "rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      aria-label="내 명함 보기"
      {...props}
    >
      <Avatar src={avatarSrc} size="default" />
    </button>
  )
}

export { MyCardButton }
export type { MyCardButtonProps }
