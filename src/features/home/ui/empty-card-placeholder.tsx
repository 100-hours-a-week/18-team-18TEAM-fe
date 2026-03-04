'use client'

import * as React from 'react'
import { QrCodeIcon, FolderOpenIcon, SearchXIcon } from 'lucide-react'
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
  searchKeyword?: string
}

function EmptyCardPlaceholder({
  onCreate,
  onImport,
  onAdd,
  title,
  description,
  searchKeyword,
  className,
  ...props
}: EmptyCardPlaceholderProps) {
  const handleCreate = onCreate || onAdd
  const hasSearchKeyword = Boolean(searchKeyword?.trim())

  const resolvedTitle =
    title ||
    (hasSearchKeyword ? '검색 결과가 없습니다' : '보유한 명함이 없습니다')
  const resolvedDescription =
    description ||
    (hasSearchKeyword
      ? '다른 이름이나 회사명으로 다시 검색해 보세요.'
      : '명함을 공유받고 명함 관리를 시작해 보세요.')

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
        <EmptyMedia
          variant="icon"
          className={
            hasSearchKeyword
              ? 'bg-destructive/10 text-destructive'
              : 'bg-muted text-muted-foreground'
          }
        >
          {hasSearchKeyword ? (
            <SearchXIcon className="size-6" />
          ) : (
            <FolderOpenIcon className="size-6" />
          )}
        </EmptyMedia>
        <EmptyTitle className="text-foreground text-base font-semibold">
          {resolvedTitle}
        </EmptyTitle>
        <EmptyDescription className="text-muted-foreground text-sm">
          {resolvedDescription}
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
