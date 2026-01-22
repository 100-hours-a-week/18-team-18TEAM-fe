'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Avatar, type ProfileData } from '@/shared'

interface ProfileHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ProfileData
}

function ProfileHeader({ data, className, ...props }: ProfileHeaderProps) {
  return (
    <div
      data-slot="profile-header"
      className={cn('bg-muted/50 w-full rounded-[10px] p-6', className)}
      {...props}
    >
      <div className="flex gap-4">
        <Avatar src={data.avatarSrc} size="xl" />

        <div className="flex flex-1 flex-col justify-center space-y-1">
          <h2 className="text-foreground text-lg font-semibold">{data.name}</h2>
          {data.department && (
            <p className="text-muted-foreground text-sm">
              {data.department}
              {data.position && ` / ${data.position}`}
            </p>
          )}
          {data.company && (
            <p className="text-muted-foreground text-sm">{data.company}</p>
          )}
          {data.phone && (
            <p className="text-foreground text-sm">M: {data.phone}</p>
          )}
          {data.email && (
            <p className="text-foreground text-sm">E: {data.email}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export { ProfileHeader }
export type { ProfileHeaderProps }
