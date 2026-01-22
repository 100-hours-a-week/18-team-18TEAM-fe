"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar, type ProfileData } from "@/shared"

interface ShareCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ProfileData
}

function ShareCard({ data, className, ...props }: ShareCardProps) {
  return (
    <div
      data-slot="share-card"
      className={cn(
        "w-full rounded-[10px] bg-card border border-border p-6 shadow-sm",
        className
      )}
      {...props}
    >
      <div className="flex gap-4">
        <Avatar src={data.avatarSrc} size="xl" />

        <div className="flex flex-col justify-center flex-1 space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{data.name}</h3>
          {data.department && (
            <p className="text-sm text-muted-foreground">
              {data.department}
              {data.position && ` / ${data.position}`}
            </p>
          )}
          {data.company && (
            <p className="text-sm text-muted-foreground">{data.company}</p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-1 text-sm">
        {data.phone && <p>M: {data.phone}</p>}
        {data.email && <p>E: {data.email}</p>}
        {data.tel && <p>T: {data.tel}</p>}
      </div>
    </div>
  )
}

export { ShareCard }
export type { ShareCardProps }
