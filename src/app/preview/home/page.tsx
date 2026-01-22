"use client"

import * as React from "react"
import { toast, Toaster } from "@/shared"
import {
  BusinessCardItem,
  BusinessCardList,
  EmptyCardPlaceholder,
  FAB,
  FABMenu,
  MyCardButton,
  SearchInput,
} from "@/features/home/components"

const sampleCards = [
  {
    id: "1",
    name: "홍길동",
    cardName: "개발자 명함",
    department: "개발팀",
    position: "시니어 개발자",
    phone: "010-1234-5678",
    email: "hong@caro.kr",
  },
  {
    id: "2",
    name: "김영희",
    cardName: "세일즈 명함",
    department: "영업팀",
    position: "매니저",
    phone: "010-2345-6789",
    email: "younghee@caro.kr",
  },
]

export default function HomePreviewPage() {
  const [fabOpen, setFabOpen] = React.useState(false)
  const [keyword, setKeyword] = React.useState("")

  const filtered = sampleCards.filter(
    (card) =>
      card.name.includes(keyword) ||
      card.cardName?.includes(keyword) ||
      card.department?.includes(keyword) ||
      card.position?.includes(keyword)
  )

  return (
    <div className="container mx-auto py-10 px-4">
      <Toaster />
      <header className="space-y-1 mb-8">
        <h1 className="text-2xl font-bold text-foreground">Home Component Preview</h1>
        <p className="text-sm text-muted-foreground">
          홈 화면용 컴포넌트들의 상호작용을 확인하는 페이지입니다.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <SearchInput
          placeholder="이름/부서/직책으로 검색"
          onSearch={setKeyword}
        />

        <MyCardButton onClick={() => toast.success("내 명함 보기")} />

        {filtered.length ? (
          <BusinessCardList>
            {filtered.map((card) => (
              <BusinessCardItem
                key={card.id}
                {...card}
                onPress={() => toast.info(`${card.name} 카드 선택`)}
                onEdit={() => toast.info(`${card.name} 수정`)}
                onDelete={() => toast.error(`${card.name} 삭제`)}
              />
            ))}
          </BusinessCardList>
        ) : (
          <EmptyCardPlaceholder
            onCreate={() => toast.success("명함 만들기")}
            onImport={() => toast.info("명함 불러오기")}
          />
        )}
      </div>

      <FAB open={fabOpen} onClick={() => setFabOpen((prev) => !prev)} />
      <FABMenu
        open={fabOpen}
        onClose={() => setFabOpen(false)}
        onShareCard={() => toast.info("내 명함 공유")}
        onScanQR={() => toast.info("QR 코드 스캔")}
      />
    </div>
  )
}
