'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar, type ProfileData } from '@/shared'

interface ShareCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ProfileData
}

function ShareCard({ data, className, ...props }: ShareCardProps) {
  return (
    <div
      data-slot="share-card"
      className={cn(
        'bg-card border-border w-full rounded-[10px] border p-6 shadow-sm',
        className
      )}
      {...props}
    >
      <div className="flex gap-4">
        <Avatar src={data.avatarSrc} size="xl" />

        <div className="flex flex-1 flex-col justify-center space-y-1">
          <h3 className="text-foreground text-lg font-semibold">{data.name}</h3>
          {data.department && (
            <p className="text-muted-foreground text-sm">
              {data.department}
              {data.position && ` / ${data.position}`}
            </p>
          )}
          {data.company && (
            <p className="text-muted-foreground text-sm">{data.company}</p>
          )}
        </div>
      </div>

      <div className="border-border mt-4 space-y-1 border-t pt-4 text-sm">
        {data.phone && <p>M: {data.phone}</p>}
        {data.email && <p>E: {data.email}</p>}
        {data.tel && <p>T: {data.tel}</p>}
      </div>
    </div>
  )
}

export { ShareCard }
export type { ShareCardProps }
