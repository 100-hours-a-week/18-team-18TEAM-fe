'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { SettingsIcon, EditIcon, UserIcon, HexagonIcon, StarIcon } from 'lucide-react'
import {
  Header,
  BottomNav,
  AlertDialog,
  type MenuItem,
  type BottomNavItem,
} from '@/shared'
import {
  UserDetailDrawer,
  type CareerItem,
  type LinkItem,
  type ProjectItem,
  type ActivityItem,
} from '@/features/user-detail'
import { useMyProfile } from '@/features/user'
import { GlassCardPreview } from './glass-card-preview'
import { CardInfoSection } from './card-info-section'

type NavTab = 'user-detail' | 'charts' | 'reviews'

// TODO: 경력/기술/링크/프로젝트/활동 API 연결 필요
const MOCK_CAREER_DATA: CareerItem[] = [
  {
    id: '1',
    company: '카로 주식회사',
    position: '프론트엔드 개발자',
    period: '2023.01 - 현재',
    description: 'React, TypeScript를 활용한 웹 애플리케이션 개발',
  },
  {
    id: '2',
    company: '테크 스타트업',
    position: '주니어 개발자',
    period: '2021.03 - 2022.12',
    description: 'JavaScript, Vue.js 기반 프론트엔드 개발',
  },
]

const MOCK_SKILLS_DATA: string[] = [
  'React',
  'TypeScript',
  'Next.js',
  'Tailwind CSS',
  'Node.js',
]

const MOCK_LINKS_DATA: LinkItem[] = [
  {
    id: '1',
    title: 'GitHub',
    url: 'https://github.com/honggildong',
    description: '개인 GitHub 프로필',
  },
  {
    id: '2',
    title: '기술 블로그',
    url: 'https://blog.example.com',
    description: '개발 관련 기술 포스팅',
  },
]

const MOCK_PROJECTS_DATA: ProjectItem[] = [
  {
    id: '1',
    name: 'CARO 명함 서비스',
    period: '2024.01 - 현재',
    description:
      '디지털 명함 관리 서비스 프론트엔드 개발. React, TypeScript, Next.js를 활용하여 모바일 친화적인 UI/UX 구현.',
  },
  {
    id: '2',
    name: 'E-commerce 플랫폼',
    period: '2023.06 - 2023.12',
    description:
      '온라인 쇼핑몰 프론트엔드 리뉴얼 프로젝트. 성능 최적화 및 접근성 개선.',
  },
]

const MOCK_ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: '1',
    title: 'React Korea 밋업 발표',
    period: '2024.03',
    description: 'Next.js 14 App Router 마이그레이션 경험 공유',
  },
  {
    id: '2',
    title: '오픈소스 컨트리뷰션',
    period: '2023.01 - 현재',
    description: 'shadcn/ui 한국어 문서화 기여',
  },
]

function MyCardPage() {
  const router = useRouter()
  const [isFlip, setIsFlip] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<NavTab | undefined>(undefined)

  // 내 정보 조회
  const { data: profileData, userInfo, isLoading, isError } = useMyProfile()

  // AI 설명 (API의 description 필드 사용)
  const aiDescription = userInfo?.description || ''

  // 삭제 확인 모달 상태
  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean
    type: 'career' | 'project' | 'activity'
    id: string
  }>({ open: false, type: 'career', id: '' })

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
      onClick: () => router.push('/my-card/edit'),
    },
  ]

  const handleClose = () => {
    router.back()
  }

  const handlePhoneClick = () => {
    if (profileData?.phone) {
      window.location.href = `tel:${profileData.phone}`
    }
  }

  const handleEmailClick = () => {
    if (profileData?.email) {
      navigator.clipboard.writeText(profileData.email)
    }
  }

  const handleTelClick = () => {
    if (profileData?.tel) {
      window.location.href = `tel:${profileData.tel}`
    }
  }

  const handleTabChange = (tab: NavTab) => {
    setActiveTab((prev) => (prev === tab ? undefined : tab))
  }

  // 프로필 편집 핸들러
  const handleProfileEdit = () => {
    router.push('/user/edit/profile')
  }

  // 경력 핸들러
  const handleCareerAdd = () => {
    router.push('/user/edit/career/new')
  }

  const handleCareerEdit = (id: string) => {
    router.push(`/user/edit/career/${id}`)
  }

  const handleCareerDelete = (id: string) => {
    setDeleteDialog({ open: true, type: 'career', id })
  }

  // 기술 핸들러
  const handleSkillAdd = () => {
    router.push('/user/edit/skills')
  }

  const handleSkillEdit = (skill: string) => {
    router.push(`/user/edit/skills?edit=${encodeURIComponent(skill)}`)
  }

  // 링크 핸들러
  const handleLinkAdd = () => {
    router.push('/user/edit/links/new')
  }

  const handleLinkEdit = (id: string) => {
    router.push(`/user/edit/links/${id}`)
  }

  // 프로젝트 핸들러
  const handleProjectAdd = () => {
    router.push('/user/edit/projects/new')
  }

  const handleProjectEdit = (id: string) => {
    router.push(`/user/edit/projects/${id}`)
  }

  const handleProjectDelete = (id: string) => {
    setDeleteDialog({ open: true, type: 'project', id })
  }

  // 활동 핸들러
  const handleActivityAdd = () => {
    router.push('/user/edit/activities/new')
  }

  const handleActivityEdit = (id: string) => {
    router.push(`/user/edit/activities/${id}`)
  }

  const handleActivityDelete = (id: string) => {
    setDeleteDialog({ open: true, type: 'activity', id })
  }

  // 삭제 확인
  const handleDeleteConfirm = () => {
    // TODO: API 호출하여 실제 삭제 처리
    console.log(`Deleting ${deleteDialog.type} with id: ${deleteDialog.id}`)
    setDeleteDialog({ open: false, type: 'career', id: '' })
  }

  const getDeleteDialogTitle = () => {
    switch (deleteDialog.type) {
      case 'career':
        return '경력을 삭제하시겠습니까?'
      case 'project':
        return '프로젝트를 삭제하시겠습니까?'
      case 'activity':
        return '활동을 삭제하시겠습니까?'
      default:
        return '삭제하시겠습니까?'
    }
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

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  // 에러 상태
  if (isError || !profileData) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="bg-background flex min-h-screen flex-col pt-14 pb-[67px]">
      <Header showClose onClose={handleClose} menuItems={menuItems} />

      {/* 이미지 + GlassCard 영역 */}
      <div className="relative overflow-hidden">
        {/* 프로필 이미지 영역 */}
        <div className="h-[526px] w-full bg-gradient-to-b from-gray-700 to-gray-900">
          {profileData.avatarSrc ? (
            <img
              src={profileData.avatarSrc}
              alt={`${profileData.name}의 프로필 이미지`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-muted-foreground text-6xl">
                {profileData.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* GlassCardPreview - 이미지 위에 겹침 */}
        <GlassCardPreview
          className="absolute bottom-4 left-1/2 z-10 max-h-[130px] w-full max-w-[400px] -translate-x-1/2 overflow-hidden"
          data={profileData}
          isFlip={isFlip}
          onFlipChange={setIsFlip}
          aiDescription={aiDescription}
        />
      </div>

      {/* 명함 정보 영역 */}
      <CardInfoSection
        info={{
          phone: profileData.phone,
          email: profileData.email,
          tel: profileData.tel,
        }}
        onPhoneClick={handlePhoneClick}
        onEmailClick={handleEmailClick}
        onTelClick={handleTelClick}
      />

      {/* 상세 정보 Drawer */}
      <UserDetailDrawer
        open={activeTab === 'user-detail'}
        onOpenChange={(open) => !open && setActiveTab(undefined)}
        profileData={profileData}
        careerData={MOCK_CAREER_DATA}
        skillsData={MOCK_SKILLS_DATA}
        linksData={MOCK_LINKS_DATA}
        projectsData={MOCK_PROJECTS_DATA}
        activitiesData={MOCK_ACTIVITIES_DATA}
        isOwner
        onProfileEdit={handleProfileEdit}
        onCareerAdd={handleCareerAdd}
        onCareerEdit={handleCareerEdit}
        onCareerDelete={handleCareerDelete}
        onSkillAdd={handleSkillAdd}
        onSkillEdit={handleSkillEdit}
        onLinkAdd={handleLinkAdd}
        onLinkEdit={handleLinkEdit}
        onProjectAdd={handleProjectAdd}
        onProjectEdit={handleProjectEdit}
        onProjectDelete={handleProjectDelete}
        onActivityAdd={handleActivityAdd}
        onActivityEdit={handleActivityEdit}
        onActivityDelete={handleActivityDelete}
      />

      {/* 역량 차트 섹션 */}
      {activeTab === 'charts' && (
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <p className="text-muted-foreground">역량 차트 (준비 중)</p>
        </div>
      )}

      {/* 리뷰 섹션 */}
      {activeTab === 'reviews' && (
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <p className="text-muted-foreground">리뷰 (준비 중)</p>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <BottomNav items={navItems} activeId={activeTab} />

      {/* 삭제 확인 모달 */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          setDeleteDialog((prev) => ({ ...prev, open }))
        }
        title={getDeleteDialogTitle()}
        type="destructive"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export { MyCardPage }
