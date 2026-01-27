'use client'

import * as React from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from '@/components/ui/drawer'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import type { ProfileData } from '@/shared'
import { ProfileHeader } from './profile-header'
import { DetailTabs, type TabId } from './detail-tabs'
import { CareerList, type CareerItem } from './career-list'
import { SkillsList } from './skills-list'
import { LinksList, type LinkItem } from './links-list'
import { ProjectsList, type ProjectItem } from './projects-list'
import { ActivitiesList, type ActivityItem } from './activities-list'

interface UserDetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileData: ProfileData
  careerData: CareerItem[]
  skillsData: string[]
  linksData: LinkItem[]
  projectsData: ProjectItem[]
  activitiesData: ActivityItem[]
  isOwner?: boolean
  onProfileEdit?: () => void
  onCareerAdd?: () => void
  onCareerEdit?: (id: string) => void
  onCareerDelete?: (id: string) => void
  onSkillAdd?: () => void
  onSkillEdit?: (skill: string) => void
  onLinkAdd?: () => void
  onLinkEdit?: (id: string) => void
  onProjectAdd?: () => void
  onProjectEdit?: (id: string) => void
  onProjectDelete?: (id: string) => void
  onActivityAdd?: () => void
  onActivityEdit?: (id: string) => void
  onActivityDelete?: (id: string) => void
}

function UserDetailDrawer({
  open,
  onOpenChange,
  profileData,
  careerData,
  skillsData,
  linksData,
  projectsData,
  activitiesData,
  isOwner = false,
  onProfileEdit,
  onCareerAdd,
  onCareerEdit,
  onCareerDelete,
  onSkillAdd,
  onSkillEdit,
  onLinkAdd,
  onLinkEdit,
  onProjectAdd,
  onProjectEdit,
  onProjectDelete,
  onActivityAdd,
  onActivityEdit,
  onActivityDelete,
}: UserDetailDrawerProps) {
  const [detailTab, setDetailTab] = React.useState<TabId>('career')

  const renderDetailContent = () => {
    switch (detailTab) {
      case 'career':
        return (
          <CareerList
            items={careerData}
            isOwner={isOwner}
            onAdd={onCareerAdd}
            onEdit={onCareerEdit}
            onDelete={onCareerDelete}
          />
        )
      case 'skills':
        return (
          <SkillsList
            items={skillsData}
            isOwner={isOwner}
            onAdd={onSkillAdd}
            onEdit={onSkillEdit}
          />
        )
      case 'links':
        return (
          <LinksList
            items={linksData}
            isOwner={isOwner}
            onAdd={onLinkAdd}
            onEdit={onLinkEdit}
          />
        )
      case 'projects':
        return (
          <ProjectsList
            items={projectsData}
            isOwner={isOwner}
            onAdd={onProjectAdd}
            onEdit={onProjectEdit}
            onDelete={onProjectDelete}
          />
        )
      case 'activities':
        return (
          <ActivitiesList
            items={activitiesData}
            isOwner={isOwner}
            onAdd={onActivityAdd}
            onEdit={onActivityEdit}
            onDelete={onActivityDelete}
          />
        )
      default:
        return null
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <VisuallyHidden.Root>
          <DrawerTitle>사용자 상세 정보</DrawerTitle>
        </VisuallyHidden.Root>
        <div className="flex flex-col overflow-hidden">
          {/* 프로필 헤더 */}
          <div className="px-4 pt-4">
            <ProfileHeader
              data={profileData}
              isOwner={isOwner}
              onEditClick={onProfileEdit}
            />
          </div>

          {/* 탭 바 */}
          <div className="px-4 pt-4">
            <DetailTabs activeTab={detailTab} onTabChange={setDetailTab} />
          </div>

          {/* 탭 콘텐츠 */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
            {renderDetailContent()}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export { UserDetailDrawer }
export type { UserDetailDrawerProps }
