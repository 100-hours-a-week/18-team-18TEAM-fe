'use client'

import * as React from 'react'
import { QrCodeIcon, FolderOpenIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

interface EmptyCardPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  onCreate?: () => void
  onImport?: () => void
  /** @deprecated onCreate로 대체 */
  onAdd?: () => void
  title?: string
  description?: string
}

function EmptyCardPlaceholder({
  onCreate,
  onImport,
  onAdd,
  title = '보유한 명함이 없습니다',
  description = '명함을 공유받고 명함 관리를 시작해 보세요.',
  className,
  ...props
}: EmptyCardPlaceholderProps) {
  const handleCreate = onCreate || onAdd

  return (
    <Empty
      data-slot="empty-card-placeholder"
      className={cn(
        'border-border/70 bg-muted/30 w-full rounded-[14px] border border-dashed px-6 py-8',
        'shadow-inner',
        className
      )}
      {...props}
    >
      <EmptyHeader className="gap-3">
        <EmptyMedia variant="icon" className="bg-muted text-muted-foreground">
          <FolderOpenIcon className="size-6" />
        </EmptyMedia>
        <EmptyTitle className="text-foreground text-base font-semibold">
          {title}
        </EmptyTitle>
        <EmptyDescription className="text-muted-foreground text-sm">
          {description}
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        {/* {handleCreate && (
          <Button size="lg" className="w-full sm:w-auto" onClick={handleCreate}>
            종이 명함 추가하기
          </Button>
        )} */}
        {onImport && (
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={onImport}
          >
            <QrCodeIcon className="size-5" />
            QR 코드 스캔
          </Button>
        )}
      </EmptyContent>
    </Empty>
  )
}

export { EmptyCardPlaceholder }
export type { EmptyCardPlaceholderProps }
