'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EmptyCareerCardProps {
  className?: string
}

function EmptyCareerCard({ className }: EmptyCareerCardProps) {
  const router = useRouter()

  const handleAddCareer = () => {
    router.push('/career/new')
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10',
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-base font-medium text-gray-700">
          아직 등록된 경력이 없습니다
        </p>
        <p className="text-sm text-gray-500">
          경력을 추가하면 명함을 공유할 수 있습니다
        </p>
      </div>

      <Button onClick={handleAddCareer} className="gap-2">
        <PlusCircleIcon className="size-4" />
        경력 추가하러 가기
      </Button>
    </div>
  )
}

export { EmptyCareerCard }
export type { EmptyCareerCardProps }
