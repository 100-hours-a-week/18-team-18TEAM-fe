'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Field } from '@/shared'
import { useMyInfo } from '@/features/user'
import { useUpdateProfileImage } from '../api'
import { ImageUpload } from './image-upload'

function ProfileEditForm() {
  const router = useRouter()
  const { data: userInfo, isLoading } = useMyInfo()
  const updateProfileImage = useUpdateProfileImage()

  const [currentImage, setCurrentImage] = React.useState<string | undefined>()
  const originalImage = userInfo?.profile_image_url || ''

  React.useEffect(() => {
    if (userInfo) {
      setCurrentImage(userInfo.profile_image_url || '')
    }
  }, [userInfo])

  const handleImageChange = (value: string | undefined) => {
    setCurrentImage(value)
  }

  const handleSaveImage = async (key: string | null) => {
    await updateProfileImage.mutateAsync(key)
  }

  const handleSuccess = () => {
    router.back() // 저장 성공 시에만 내 명함 페이지로 이동
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* 프로필 이미지 */}
      <ImageUpload
        value={currentImage}
        originalValue={originalImage}
        onChange={handleImageChange}
        onSave={handleSaveImage}
        onSuccess={handleSuccess}
        className="mb-2"
      />

      {/* 이메일 (읽기 전용) */}
      <div className="space-y-2">
        <p className="text-xs text-green-600">
          지금 계정과 연동된 이메일입니다.
        </p>
        <Field
          label="이메일"
          value={userInfo?.email || ''}
          readOnly
          disabled
          className="opacity-70"
        />
      </div>
    </div>
  )
}

export { ProfileEditForm }
