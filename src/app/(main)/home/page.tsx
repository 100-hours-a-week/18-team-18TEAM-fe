'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  SearchInput,
  MyCardButton,
  BusinessCardList,
  BusinessCardItem,
  EmptyCardPlaceholder,
  FAB,
  FABMenu,
} from '@/features/home/ui'
import { useWallets, useDeleteWalletCard } from '@/features/home/api'
import { useRouter } from 'next/navigation'
import { toast } from '@/shared'

export default function HomePage() {
  const [fabOpen, setFabOpen] = React.useState(false)
  const [keyword, setKeyword] = React.useState('')
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

  const handleDelete = async (cardId: number) => {
    try {
      await deleteCard.mutateAsync(cardId)
      toast.success('명함이 삭제되었습니다.')
    } catch {
      toast.error('명함 삭제에 실패했습니다.')
    }
  }

  const handleSearch = (value: string) => {
    setKeyword(value)
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
        <div className="absolute right-6">
          <MyCardButton onClick={() => router.push('/my-card')} />
        </div>
      </header>

      {/* 검색창 */}
      <div className="px-6 py-4">
        <SearchInput
          placeholder="검색어를 입력하세요."
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
        />
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
                onPress={() => router.push(`/user/${card.user_id}`)}
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
      />
    </div>
  )
}
