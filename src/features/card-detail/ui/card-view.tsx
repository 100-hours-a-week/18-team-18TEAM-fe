'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  SettingsIcon,
  EditIcon,
  UserIcon,
  HexagonIcon,
  StarIcon,
} from 'lucide-react'
import {
  Header,
  BottomNav,
  AlertDialog,
  toast,
  type MenuItem,
  type BottomNavItem,
  type ProfileData,
} from '@/shared'
import {
  UserDetailDrawer,
  type CareerItem,
  type LinkItem,
  type ProjectItem,
  type ActivityItem,
} from '@/features/user-detail'
import {
  useCareers,
  useUserCareers,
  useDeleteCareer,
} from '@/features/career-edit'
import type { UserInfo } from '@/features/user/model'
import { GlassCardPreview } from './glass-card-preview'
import { CardInfoSection } from './card-info-section'

type NavTab = 'user-detail' | 'charts' | 'reviews'

/** 날짜 문자열을 YYYY.MM 형식으로 변환 */
function formatDateToMonth(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}.${month}`
}

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

interface CardViewProps {
  profileData: ProfileData
  userInfo?: UserInfo
  userId?: string
  showMenu?: boolean
  isOwner?: boolean
}

function CardView({
  profileData,
  userInfo,
  userId,
  showMenu = false,
  isOwner = false,
}: CardViewProps) {
  const router = useRouter()
  const [isFlip, setIsFlip] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<NavTab | undefined>(
    undefined
  )

  // 경력 API 연동 - isOwner면 내 경력, 아니면 해당 유저 경력 조회
  const { data: myCareersData } = useCareers()
  const { data: userCareersData } = useUserCareers(userId, {
    enabled: !isOwner && Boolean(userId),
  })
  const careersData = isOwner ? myCareersData : userCareersData
  const deleteCareerMutation = useDeleteCareer()

  // API 응답을 CareerItem 형식으로 변환
  const careerItems: CareerItem[] = React.useMemo(() => {
    if (!careersData) return []
    return careersData.map((career) => ({
      id: String(career.id),
      company: career.company || '',
      position: career.position || '',
      period: career.is_progress
        ? `${formatDateToMonth(career.start_date)} - 현재`
        : `${formatDateToMonth(career.start_date)} - ${formatDateToMonth(career.end_date)}`,
      description: career.department || undefined,
    }))
  }, [careersData])

  // AI 설명 (API의 description 필드 사용)
  const aiDescription = userInfo?.description || ''

  // 삭제 확인 모달 상태
  const [deleteDialog, setDeleteDialog] = React.useState<{
    open: boolean
    type: 'career' | 'project' | 'activity'
    id: string
  }>({ open: false, type: 'career', id: '' })

  const menuItems: MenuItem[] = showMenu
    ? [
        {
          id: 'settings',
          label: '설정',
          icon: <SettingsIcon className="size-4" />,
          onClick: () => router.push('/settings'),
        },
        {
          id: 'edit-card',
          label: '프로필 수정하기',
          icon: <EditIcon className="size-4" />,
          onClick: () => router.push('/my-card/edit'),
        },
      ]
    : []

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
    router.push('/my-card/edit')
  }

  // 경력 핸들러
  const handleCareerAdd = () => {
    router.push('/career/new')
  }

  const handleCareerEdit = (id: string) => {
    router.push(`/career/${id}/edit`)
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
  const handleDeleteConfirm = async () => {
    const { type, id } = deleteDialog
    setDeleteDialog({ open: false, type: 'career', id: '' })

    if (type === 'career') {
      try {
        await deleteCareerMutation.mutateAsync(id)
        toast.success('경력이 삭제되었습니다.')
      } catch {
        toast.error('경력 삭제 중 오류가 발생했습니다.')
      }
    } else {
      // TODO: 프로젝트, 활동 삭제 API 연동
      console.log(`Deleting ${type} with id: ${id}`)
    }
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

  return (
    <div className="bg-background flex min-h-screen flex-col pt-14 pb-[67px]">
      <Header
        showClose
        onClose={handleClose}
        menuItems={showMenu ? menuItems : undefined}
      />

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
        careerData={careerItems}
        skillsData={MOCK_SKILLS_DATA}
        linksData={MOCK_LINKS_DATA}
        projectsData={MOCK_PROJECTS_DATA}
        activitiesData={MOCK_ACTIVITIES_DATA}
        isOwner={isOwner}
        onProfileEdit={isOwner ? handleProfileEdit : undefined}
        onCareerAdd={isOwner ? handleCareerAdd : undefined}
        onCareerEdit={isOwner ? handleCareerEdit : undefined}
        onCareerDelete={isOwner ? handleCareerDelete : undefined}
        onSkillAdd={isOwner ? handleSkillAdd : undefined}
        onSkillEdit={isOwner ? handleSkillEdit : undefined}
        onLinkAdd={isOwner ? handleLinkAdd : undefined}
        onLinkEdit={isOwner ? handleLinkEdit : undefined}
        onProjectAdd={isOwner ? handleProjectAdd : undefined}
        onProjectEdit={isOwner ? handleProjectEdit : undefined}
        onProjectDelete={isOwner ? handleProjectDelete : undefined}
        onActivityAdd={isOwner ? handleActivityAdd : undefined}
        onActivityEdit={isOwner ? handleActivityEdit : undefined}
        onActivityDelete={isOwner ? handleActivityDelete : undefined}
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
      {isOwner && (
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
      )}
    </div>
  )
}

export { CardView }
export type { CardViewProps }
