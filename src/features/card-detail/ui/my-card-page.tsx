'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { SettingsIcon, EditIcon, UserIcon, HexagonIcon, StarIcon } from 'lucide-react'
import {
  Header,
  BottomNav,
  type MenuItem,
  type ProfileData,
  type BottomNavItem,
} from '@/shared'
import { GlassCardPreview } from './glass-card-preview'
import { CardInfoSection } from './card-info-section'

type NavTab = 'user-detail' | 'charts' | 'reviews'

// TODO: API에서 가져올 데이터 - 추후 TanStack Query로 교체
const MOCK_PROFILE_DATA: ProfileData = {
  name: '홍길동',
  department: '개발팀',
  position: '프론트엔드 개발자',
  company: '카로 주식회사',
  phone: '010-1234-5678',
  email: 'hong@caro.com',
  tel: '02-1234-5678',
  avatarSrc: '/image/example_img.png',
}

const MOCK_AI_DESCRIPTION =
  '프론트엔드 개발 전문가로서 React, TypeScript, Next.js를 활용한 웹 애플리케이션 개발에 강점을 보유하고 있습니다. 프론트엔드 개발 전문가로서 React, TypeScript, Next.js를 활용한 웹 애플리케이션 개발에 강점을 보유하고 있습니다.'

function MyCardPage() {
  const router = useRouter()
  const [isFlip, setIsFlip] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<NavTab | undefined>(undefined)

  const menuItems: MenuItem[] = [
    {
      id: 'settings',
      label: '설정',
      icon: <SettingsIcon className="size-4" />,
      onClick: () => router.push('/settings'),
    },
    {
      id: 'edit-card',
      label: '명함 수정하기',
      icon: <EditIcon className="size-4" />,
      onClick: () => router.push('/user/edit'),
    },
  ]

  const handleClose = () => {
    router.back()
  }

  const handlePhoneClick = () => {
    if (MOCK_PROFILE_DATA.phone) {
      window.location.href = `tel:${MOCK_PROFILE_DATA.phone}`
    }
  }

  const handleEmailClick = () => {
    if (MOCK_PROFILE_DATA.email) {
      navigator.clipboard.writeText(MOCK_PROFILE_DATA.email)
    }
  }

  const handleTelClick = () => {
    if (MOCK_PROFILE_DATA.tel) {
      window.location.href = `tel:${MOCK_PROFILE_DATA.tel}`
    }
  }

  const handleTabChange = (tab: NavTab) => {
    setActiveTab((prev) => (prev === tab ? undefined : tab))
  }

  const navItems: BottomNavItem[] = [
    {
      id: 'user-detail',
      icon: <UserIcon className="size-5" />,
      label: '상세 정보',
      onClick: () => handleTabChange('user-detail'),
    },
    {
      id: 'charts',
      icon: <HexagonIcon className="size-5" />,
      label: '역량 차트',
      onClick: () => handleTabChange('charts'),
    },
    {
      id: 'reviews',
      icon: <StarIcon className="size-5" />,
      label: '리뷰',
      onClick: () => handleTabChange('reviews'),
    },
  ]

  return (
    <div className="bg-background flex min-h-screen flex-col pt-14 pb-[67px]">
      <Header showClose onClose={handleClose} menuItems={menuItems} />

      {/* 이미지 + GlassCard 영역 */}
      <div className="relative overflow-hidden">
        {/* 프로필 이미지 영역 */}
        <div className="h-[526px] w-full bg-gradient-to-b from-gray-700 to-gray-900">
          {MOCK_PROFILE_DATA.avatarSrc ? (
            <img
              src={MOCK_PROFILE_DATA.avatarSrc}
              alt={`${MOCK_PROFILE_DATA.name}의 프로필 이미지`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-muted-foreground text-6xl">
                {MOCK_PROFILE_DATA.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* GlassCardPreview - 이미지 위에 겹침 */}
        <GlassCardPreview
          className="absolute bottom-4 left-1/2 z-10 max-h-[130px] w-full max-w-[400px] -translate-x-1/2 overflow-hidden"
          data={MOCK_PROFILE_DATA}
          isFlip={isFlip}
          onFlipChange={setIsFlip}
          aiDescription={MOCK_AI_DESCRIPTION}
        />
      </div>

      {/* 명함 정보 영역 */}
      <CardInfoSection
        info={{
          phone: MOCK_PROFILE_DATA.phone,
          email: MOCK_PROFILE_DATA.email,
          tel: MOCK_PROFILE_DATA.tel,
        }}
        onPhoneClick={handlePhoneClick}
        onEmailClick={handleEmailClick}
        onTelClick={handleTelClick}
      />

      {/* 하단 네비게이션 */}
      <BottomNav items={navItems} activeId={activeTab} />
    </div>
  )
}

export { MyCardPage }
