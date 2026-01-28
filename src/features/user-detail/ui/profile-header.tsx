'use client'

import * as React from 'react'
import { PencilIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, type ProfileData } from '@/shared'

interface ProfileHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ProfileData
  isOwner?: boolean
  onEditClick?: () => void
}

function ProfileHeader({
  data,
  isOwner = false,
  onEditClick,
  className,
  ...props
}: ProfileHeaderProps) {
  return (
    <div
      data-slot="profile-header"
      className={cn('bg-muted/50 relative w-full rounded-[10px] p-6', className)}
      {...props}
    >
      {isOwner && onEditClick && (
        <button
          type="button"
          onClick={onEditClick}
          className="hover:bg-muted absolute top-[10px] right-[9px] rounded-md p-1 transition-colors"
          aria-label="프로필 수정"
        >
          <PencilIcon className="text-muted-foreground size-6" />
        </button>
      )}

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
