'use client'

import * as React from 'react'
import { CameraIcon } from 'lucide-react'
import { Avatar, toast } from '@/shared'
import { cn } from '@/lib/utils'
import { getPresignedUrl, uploadToS3 } from '../api/profile.api'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

interface ImageUploadProps {
  value?: string
  originalValue?: string // 원본 이미지 URL (isDirty 비교용)
  onChange?: (value: string | undefined) => void
  onSave?: (key: string | null) => Promise<void> // PATCH 호출 콜백
  onSuccess?: () => void // 저장 성공 시 콜백 (페이지 이동용)
  className?: string
}

function ImageUpload({
  value,
  originalValue,
  onChange,
  onSave,
  onSuccess,
  className,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [pendingFile, setPendingFile] = React.useState<File | null>(null)
  const [pendingHash, setPendingHash] = React.useState<string | null>(null)
  const [originalHash, setOriginalHash] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)

  // 원본 이미지 해시 계산 (동일 이미지 업로드 방지)
  React.useEffect(() => {
    let canceled = false

    async function fetchAndHash() {
      if (!originalValue) {
        setOriginalHash(null)
        return
      }

      try {
        const response = await fetch(originalValue)
        if (!response.ok) throw new Error('failed to fetch original image')
        const buffer = await response.arrayBuffer()
        const hash = await computeHash(buffer)
        if (!canceled) setOriginalHash(hash)
      } catch {
        // CORS 차단 등으로 해시 계산 실패 시, 중복 검증은 생략
        if (!canceled) setOriginalHash(null)
      }
    }

    fetchAndHash()
    return () => {
      canceled = true
    }
  }, [originalValue])

  const handleClick = () => {
    if (isUploading) return
    inputRef.current?.click()
  }

  const handleRemove = () => {
    if (isUploading) return
    inputRef.current && (inputRef.current.value = '')
    onChange?.(undefined)
    setPendingFile(null)
    setPendingHash(null)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // 업로드는 저장 버튼에서 수행
    setPendingFile(file)

    // 해시 계산 (동일 이미지 방지용)
    try {
      const buffer = await file.arrayBuffer()
      const hash = await computeHash(buffer)
      setPendingHash(hash)

      if (originalHash && hash === originalHash) {
        toast.error('이미 등록된 이미지입니다.')
        setPendingFile(null)
        return
      }
    } catch {
      setPendingHash(null)
    }
  }

  const handleSaveUpload = async () => {
    // Base64 비교와 별개로 해시가 동일하면 업로드/패치 생략
    if (pendingHash && originalHash && pendingHash === originalHash) {
      toast.error('이미 등록된 이미지입니다.')
      return
    }

    // 1. 원본과 동일한 경우 → "이미 등록된 이미지입니다" 토스트 (페이지 이동 X)
    if (value === originalValue) {
      toast.error('이미 등록된 이미지입니다.')
      return
    }

    // 2. 이미지 삭제 (기본 이미지)인 경우 → PATCH만 (key = null)
    if (!value || value === '') {
      setIsUploading(true)
      try {
        await onSave?.(null)
        toast.success('프로필 이미지가 삭제되었습니다.')
        onSuccess?.() // 성공 시에만 페이지 이동
      } catch {
        toast.error('이미지 삭제에 실패했습니다.')
        // 실패 시 페이지 이동 X
      } finally {
        setIsUploading(false)
      }
      return
    }

    // 3. 새 이미지인 경우 → S3 업로드 + PATCH
    if (!pendingFile) return
    setIsUploading(true)
    try {
      const { url, key } = await getPresignedUrl(pendingFile.name)
      await uploadToS3(url, pendingFile)
      await onSave?.(key) // PATCH 호출
      setPendingFile(null)
      toast.success('이미지가 저장되었습니다.')
      onSuccess?.() // 성공 시에만 페이지 이동
    } catch {
      toast.error('이미지 업로드에 실패했습니다.')
      // 업로드 실패 또는 PATCH 실패 시 페이지 이동 X
    } finally {
      setIsUploading(false)
    }
  }

  // 저장 버튼 활성화 조건: 원본과 다르고, (삭제했거나 새 파일이 있는 경우)
  const canSave =
    !isUploading &&
    value !== originalValue &&
    ((!value && originalValue) || pendingFile) &&
    !(pendingHash && originalHash && pendingHash === originalHash)

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'relative cursor-pointer',
          isUploading && 'pointer-events-none opacity-50'
        )}
        aria-label="프로필 이미지 변경"
        disabled={isUploading}
      >
        <Avatar src={value} size="xl" alt="프로필 이미지" />
        <div className="bg-primary absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full">
          <CameraIcon className="text-primary-foreground size-4" />
        </div>
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted-foreground text-xs">업로드 중...</span>
          </div>
        )}
      </button>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={handleRemove}
          disabled={isUploading || !value}
          className={cn(
            'rounded px-3 py-1 text-[12px]',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            'disabled:opacity-50'
          )}
        >
          이미지 삭제
        </button>
        <button
          type="button"
          onClick={handleSaveUpload}
          disabled={!canSave}
          className={cn(
            'rounded px-3 py-1 text-[12px]',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'disabled:opacity-50'
          )}
        >
          이미지 저장
        </button>
      </div>
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

async function computeHash(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
