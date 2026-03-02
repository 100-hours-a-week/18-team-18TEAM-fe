'use client'

import { useParams } from 'next/navigation'
import { useCareer } from '@/features/career-edit'
import { CardView } from '@/features/card-detail/ui'
import type { CareerItem } from '@/features/user-detail'
import type { UserInfo } from '@/features/user/model'
import type { ProfileData } from '@/shared'

function formatDateToMonth(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}.${month}`
}

export default function OcrCardPage() {
  const params = useParams()
  const cardId = params.id as string

  const { data: card, isLoading, isError } = useCareer(cardId, {
    enabled: Boolean(cardId),
  })

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  if (isError || !card) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">정보를 불러올 수 없습니다.</p>
      </div>
    )
  }

  const profileData: ProfileData = {
    name: card.name || '',
    email: card.email,
    phone: card.phone_number,
    tel: card.lined_number || '',
    company: card.company || '',
    department: card.department || '',
    position: card.position || '',
    avatarSrc: null,
  }

  const start = formatDateToMonth(card.start_date)
  const end = formatDateToMonth(card.end_date)
  const period = card.is_progress
    ? `${start} - 현재`
    : end
      ? `${start} - ${end}`
      : start

  const careerItems: CareerItem[] = [
    {
      id: String(card.id),
      company: card.company || '',
      position: card.position || '',
      period,
      description: card.department || undefined,
    },
  ]

  return (
    <CardView
      profileData={profileData}
      userInfo={{ description: card.description || '' } as UserInfo}
      careerItemsOverride={careerItems}
      showMenu={false}
      isOwner={false}
    />
  )
}
