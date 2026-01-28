'use client'

import * as React from 'react'
import {
    SearchInput,
    MyCardButton,
    BusinessCardList,
    BusinessCardItem,
    EmptyCardPlaceholder,
    FAB,
    FABMenu,
} from '@/features/home/ui'
import { useRouter } from 'next/navigation'
// 더미 데이터 (퍼블리싱용)
const MOCK_CARDS = [
    {
        id: '1',
        company: 'kakao',
        name: '홍길동',
        department: '개발팀',
        position: '프론트엔드 개발자',
        phone_number: '010-1234-5678',
        email: 'hong@example.com',
        lined_number: '123-456-7890',
    },
    {
        id: '2',
        company: 'goorm',
        name: '김철수',
        department: '디자인팀',
        position: 'UI/UX 디자이너',
        phone_number: '010-2345-6789',
        email: 'kim@example.com',
        lined_number: '123-456-7890',
    },
    {
        id: '3',
        company: 'CJ',
        name: '이영희',
        department: '마케팅팀',
        position: '마케팅 매니저',
        phone_number: '010-3456-7890',
        email: 'lee@example.com',
        lined_number: '123-456-7890',
    },
]

export default function HomePage() {
    const [fabOpen, setFabOpen] = React.useState(false)
    const cards = MOCK_CARDS // 나중에 API 연동, 여기를 비우면 빈 상태 UI 확인 가능
    const router = useRouter()

    return (
        <div className="flex min-h-dvh flex-col">
            {/* 헤더 */}
            <header className="flex items-center justify-end px-6 py-2">
                <MyCardButton onClick={() => router.push('/my-card')} />
            </header>

            {/* 검색창 */}
            <div className="px-6 py-4">
                <SearchInput placeholder="검색어를 입력하세요.." />
            </div>

            {/* 명함 목록 */}
            <main className="flex-1 px-6">
                {cards.length === 0 ? (
                    <EmptyCardPlaceholder />
                ) : (
                    <BusinessCardList>
                        {cards.map((card) => (
                            <BusinessCardItem
                                key={card.id}
                                name={card.name}
                                company={card.company}
                                department={card.department}
                                position={card.position}
                                phone_number={card.phone_number}
                                email={card.email}
                                lined_number={card.lined_number}
                                onEdit={() => console.log('수정:', card.id)}
                                onDelete={() => console.log('삭제:', card.id)}
                            />
                        ))}
                    </BusinessCardList>
                )}
            </main>

            {/* FAB */}
            <FAB open={fabOpen} onClick={() => setFabOpen(!fabOpen)} />
            <FABMenu open={fabOpen} onClose={() => setFabOpen(false)} />
        </div>
    )
}
