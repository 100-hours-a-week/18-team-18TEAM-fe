"use client"

import * as React from "react"
import { UserIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
  {
    variants: {
      size: {
        sm: "size-8",
        default: "size-10",
        lg: "size-14",
        xl: "size-[103px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null
  alt?: string
  fallback?: React.ReactNode
}

function Avatar({
  src,
  alt = "프로필 이미지",
  fallback,
  size,
  className,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false)

  const showFallback = !src || hasError

  return (
    <div
      data-slot="avatar"
      className={cn(avatarVariants({ size, className }))}
      {...props}
    >
      {showFallback ? (
        <span className="flex items-center justify-center size-full text-muted-foreground">
          {fallback || <UserIcon className="size-1/2" />}
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          className="aspect-square size-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  )
}

export { Avatar, avatarVariants }
export type { AvatarProps }
