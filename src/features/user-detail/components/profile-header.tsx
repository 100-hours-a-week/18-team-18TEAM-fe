"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, type ProfileData } from "@/shared"

interface ProfileHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ProfileData
}

function ProfileHeader({ data, className, ...props }: ProfileHeaderProps) {
  return (
    <div
      data-slot="profile-header"
      className={cn(
        "w-full rounded-[10px] bg-muted/50 p-6",
        className
      )}
      {...props}
    >
      <div className="flex gap-4">
        <Avatar src={data.avatarSrc} size="xl" />

        <div className="flex flex-col justify-center flex-1 space-y-1">
          <h2 className="text-lg font-semibold text-foreground">{data.name}</h2>
          {data.department && (
            <p className="text-sm text-muted-foreground">
              {data.department}
              {data.position && ` / ${data.position}`}
            </p>
          )}
          {data.company && (
            <p className="text-sm text-muted-foreground">{data.company}</p>
          )}
          {data.phone && (
            <p className="text-sm text-foreground">M: {data.phone}</p>
          )}
          {data.email && (
            <p className="text-sm text-foreground">E: {data.email}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export { ProfileHeader }
export type { ProfileHeaderProps }
