'use client'

import * as React from 'react'
import Image from 'next/image'
import { MessageCircleIcon } from 'lucide-react'
import { useAtom } from 'jotai'
import {
  SearchInput,
  MyCardButton,
  BusinessCardList,
  BusinessCardItem,
  EmptyCardPlaceholder,
  FAB,
  FABMenu,
  OcrModeDialog,
} from '@/features/home/ui'
import { useWallets, useDeleteWalletCard } from '@/features/home/api'
import { useRouter } from 'next/navigation'
import { IconButton, toast } from '@/shared'
import { ocrFlowAtom, type OcrMode } from '@/features/ocr'
import { cn } from '@/lib/utils'

const SEARCH_MAX_LENGTH = 100

export default function HomePage() {
  const [fabOpen, setFabOpen] = React.useState(false)
  const [keyword, setKeyword] = React.useState('')
  const [isSearchInputFocused, setIsSearchInputFocused] = React.useState(false)
  const [isSearchLimitFeedback, setIsSearchLimitFeedback] =
    React.useState(false)
  const [isOcrModeDialogOpen, setIsOcrModeDialogOpen] = React.useState(false)
  const searchLimitFeedbackTimeoutRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null)
  const [, setOcrFlow] = useAtom(ocrFlowAtom)
  const router = useRouter()

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useWallets({ keyword: keyword || undefined })
  const deleteCard = useDeleteWalletCard()

  const cards =
    data?.pages.flatMap((page) => page.data ?? []).filter(Boolean) ?? []

  const handleShareCard = () => {
    router.push('/share')
  }

  const handleScanQR = () => {
    router.push('/scan')
  }

  const handleAddPaperCard = () => {
    router.push('/my-card/edit')
  }

  const handleScanOCR = () => {
    setIsOcrModeDialogOpen(true)
  }

  const handleSelectOcrMode = (mode: OcrMode) => {
    setOcrFlow({
      mode,
      capturedImageUrl: null,
    })
    setIsOcrModeDialogOpen(false)
    router.push('/ocr')
  }

  const handleDelete = async (cardId: number) => {
    try {
      await deleteCard.mutateAsync(cardId)
      toast.success('명함이 삭제되었습니다.')
    } catch {
      toast.error('명함 삭제에 실패했습니다.')
    }
  }

  const handleSearch = (value: string) => {
    setKeyword(value.slice(0, SEARCH_MAX_LENGTH))
  }

  const triggerSearchLimitFeedback = React.useCallback(() => {
    setIsSearchLimitFeedback(false)
    requestAnimationFrame(() => {
      setIsSearchLimitFeedback(true)
    })

    if (searchLimitFeedbackTimeoutRef.current) {
      clearTimeout(searchLimitFeedbackTimeoutRef.current)
    }

    searchLimitFeedbackTimeoutRef.current = setTimeout(() => {
      setIsSearchLimitFeedback(false)
    }, 320)
  }, [])

  React.useEffect(() => {
    return () => {
      if (searchLimitFeedbackTimeoutRef.current) {
        clearTimeout(searchLimitFeedbackTimeoutRef.current)
      }
    }
  }, [])

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.nativeEvent.isComposing) return
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (event.key.length !== 1) return

    const input = event.currentTarget
    const selectionStart = input.selectionStart ?? 0
    const selectionEnd = input.selectionEnd ?? selectionStart
    const nextLength = keyword.length - (selectionEnd - selectionStart) + 1

    if (nextLength > SEARCH_MAX_LENGTH) {
      triggerSearchLimitFeedback()
    }
  }

  const handleSearchPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = event.clipboardData.getData('text')
    if (!pastedText) return

    const input = event.currentTarget
    const selectionStart = input.selectionStart ?? 0
    const selectionEnd = input.selectionEnd ?? selectionStart
    const nextLength =
      keyword.length - (selectionEnd - selectionStart) + pastedText.length

    if (nextLength > SEARCH_MAX_LENGTH) {
      triggerSearchLimitFeedback()
    }
  }

  const handleCardPress = (cardId: number, userId: number | null) => {
    if (userId !== null) {
      router.push(`/user/${userId}`)
      return
    }

    router.push(`/cards/ocr/${cardId}`)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* 헤더: 로고 + 프로필 버튼 */}
      <header className="relative flex items-center justify-center px-6 py-4">
        <Image
          src="/icons/Bizkit_logo.png"
          alt="BizKit"
          width={184}
          height={47}
          priority
        />
        <div className="absolute right-6 flex items-center gap-2">
          <IconButton
            variant="surface"
            size="default"
            aria-label="채팅방 목록으로 이동"
            onClick={() => router.push('/chat')}
          >
            <MessageCircleIcon className="size-5" />
          </IconButton>
          <MyCardButton onClick={() => router.push('/my-card')} />
        </div>
      </header>

      {/* 검색창 */}
      <div className="px-6 py-4">
        <SearchInput
          placeholder={`검색어를 입력하세요.`}
          maxLength={SEARCH_MAX_LENGTH}
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          onPaste={handleSearchPaste}
          onFocus={() => setIsSearchInputFocused(true)}
          onBlur={() => setIsSearchInputFocused(false)}
          className={cn(
            isSearchLimitFeedback &&
              'animate-search-limit-shake [&_input]:!border-destructive [&_input]:bg-destructive/5 [&_input]:focus:!border-destructive [&_input]:focus:!ring-destructive/30 [&_svg]:text-destructive'
          )}
        />
        {isSearchInputFocused && (
          <p
            className={cn(
              'text-muted-foreground mt-1 text-right text-[11px]',
              isSearchLimitFeedback && 'text-destructive'
            )}
          >
            {keyword.length}/{SEARCH_MAX_LENGTH}자
          </p>
        )}
      </div>

      {/* 명함 목록 */}
      <main className="flex-1 px-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        ) : cards.length === 0 ? (
          <EmptyCardPlaceholder
            onCreate={handleAddPaperCard}
            onImport={handleScanQR}
            searchKeyword={keyword}
          />
        ) : (
          <BusinessCardList
            hasNext={Boolean(hasNextPage)}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          >
            {cards.map((card, index) => (
              <BusinessCardItem
                key={card.id}
                name={card.name}
                company={card.company}
                department={card.department}
                position={card.position}
                phone_number={card.phone_number}
                email={card.email}
                lined_number={card.lined_number}
                colorIndex={index}
                onPress={() => handleCardPress(card.id, card.user_id)}
                onDelete={() => handleDelete(card.id)}
              />
            ))}
          </BusinessCardList>
        )}
      </main>

      {/* FAB */}
      <FAB open={fabOpen} onClick={() => setFabOpen(!fabOpen)} />
      <FABMenu
        open={fabOpen}
        onClose={() => setFabOpen(false)}
        onShareCard={handleShareCard}
        onScanQR={handleScanQR}
        onScanOCR={handleScanOCR}
      />

      <OcrModeDialog
        open={isOcrModeDialogOpen}
        onOpenChange={setIsOcrModeDialogOpen}
        onSelectMode={handleSelectOcrMode}
      />
    </div>
  )
}
