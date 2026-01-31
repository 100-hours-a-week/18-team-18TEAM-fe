'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Field, toast } from '@/shared'
import { useMyProfile } from '@/features/user'
import { profileFormSchema, type ProfileFormData } from '../model'
import { useUpdateProfile } from '../api'
import { ImageUpload } from './image-upload'

function ProfileEditForm() {
  const router = useRouter()
  const { data: profileData, isLoading: isLoadingProfile } = useMyProfile()
  const updateProfile = useUpdateProfile()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      profileImage: '',
      name: '',
      company: '',
      department: '',
      position: '',
      phone: '',
      email: '',
      tel: '',
    },
  })

  const profileImage = watch('profileImage')

  // 프로필 데이터 로드 시 폼에 한 번에 채워넣기
  React.useEffect(() => {
    if (profileData) {
      reset({
        profileImage: profileData.avatarSrc || '',
        name: profileData.name || '',
        company: profileData.company || '',
        department: profileData.department || '',
        position: profileData.position || '',
        phone: profileData.phone || '',
        email: profileData.email || '',
        tel: profileData.tel || '',
      })
    }
  }, [profileData, reset])

  const onSubmit = async (data: ProfileFormData) => {
    if (!isDirty) {
      toast.info('변경사항이 없습니다.')
      return
    }

    try {
      await updateProfile.mutateAsync(data)
      toast.success('내 명함 정보가 업데이트되었습니다.')
      router.back()
    } catch {
      toast.error('정보 업데이트 중 오류가 발생했습니다.')
    }
  }

  const handleImageChange = (value: string | undefined) => {
    setValue('profileImage', value || '', { shouldDirty: true })
  }

  const handleS3KeyChange = (key: string | undefined) => {
    setValue('profileImageKey', key || '', { shouldDirty: true })
  }

  if (isLoadingProfile) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-4">
      {/* 프로필 이미지 */}
      <ImageUpload
        value={profileImage}
        onChange={handleImageChange}
        onS3KeyChange={handleS3KeyChange}
        className="mb-2"
      />

      {/* 이름 */}
      <Field
        label="이름"
        placeholder="이름을 입력해주세요"
        error={errors.name?.message}
        {...register('name')}
      />

      {/* 회사명 */}
      <Field
        label="회사명"
        placeholder="회사명을 입력해주세요"
        error={errors.company?.message}
        {...register('company')}
      />

      {/* 부서 */}
      <Field
        label="부서"
        placeholder="부서를 입력해주세요"
        error={errors.department?.message}
        {...register('department')}
      />

      {/* 직책 */}
      <Field
        label="직책"
        placeholder="직책을 입력해주세요"
        error={errors.position?.message}
        {...register('position')}
      />

      {/* 휴대폰 (필수) */}
      <Field
        label="휴대폰"
        placeholder="휴대폰 번호를 입력해주세요. '-' 포함"
        error={errors.phone?.message}
        required
        {...register('phone')}
      />

      {/* 이메일 (필수) */}
      <Field
        label="이메일"
        type="email"
        placeholder="예) email@domain.com"
        error={errors.email?.message}
        required
        {...register('email')}
      />

      {/* 유선전화 */}
      <Field
        label="유선전화"
        placeholder="예) 02-000-0000"
        error={errors.tel?.message}
        {...register('tel')}
      />

      {/* 저장 버튼 */}
      <Button
        type="submit"
        fullWidth
        loading={isSubmitting || updateProfile.isPending}
        disabled={!isDirty || isSubmitting || updateProfile.isPending}
        className="mt-4"
      >
        저장
      </Button>
    </form>
  )
}

export { ProfileEditForm }
