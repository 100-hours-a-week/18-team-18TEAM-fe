'use client'

import * as React from 'react'
import { CameraIcon } from 'lucide-react'
import { Avatar, toast } from '@/shared'
import { cn } from '@/lib/utils'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

interface ImageUploadProps {
  value?: string
  onChange?: (value: string | undefined) => void
  className?: string
}

function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      toast.error('이미지 크기는 10MB를 초과할 수 없습니다.')
      e.target.value = ''
      return
    }

    // 파일 형식 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('JPEG, PNG, WEBP 형식만 지원합니다.')
      e.target.value = ''
      return
    }

    // Base64로 변환하여 미리보기
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      onChange?.(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <button
        type="button"
        onClick={handleClick}
        className="relative cursor-pointer"
        aria-label="프로필 이미지 변경"
      >
        <Avatar src={value} size="xl" alt="프로필 이미지" />
        <div className="bg-primary absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full">
          <CameraIcon className="text-primary-foreground size-4" />
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  )
}

export { ImageUpload }
export type { ImageUploadProps }
