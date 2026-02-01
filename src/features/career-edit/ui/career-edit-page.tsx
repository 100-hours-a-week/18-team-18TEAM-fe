'use client'

import { useRouter } from 'next/navigation'
import { Header } from '@/shared'
import { CareerEditForm } from './career-edit-form'

interface CareerEditPageProps {
  cardId?: string
}

function CareerEditPage({ cardId }: CareerEditPageProps) {
  const router = useRouter()
  const isEditMode = Boolean(cardId)

  const handleClose = () => {
    router.back()
  }

  return (
    <div className="bg-background flex min-h-screen flex-col pt-14">
      <Header
        showClose
        onClose={handleClose}
        title={isEditMode ? '경력 수정' : '경력 추가'}
      />
      <CareerEditForm cardId={cardId} />
    </div>
  )
}

export { CareerEditPage }
export type { CareerEditPageProps }
