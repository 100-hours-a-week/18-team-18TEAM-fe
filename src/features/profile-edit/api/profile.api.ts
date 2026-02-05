import { apiClient } from '@/shared/api'

/** Presigned URL 요청 타입 */
interface GetPresignedUrlRequest {
  category: 'PROFILE' | 'CARD'
  originName: string
}

/** Presigned URL 응답 타입 (백엔드가 래퍼 없이 바로 내려줌) */
interface GetPresignedUrlResponse {
  url: string
  key: string
  expiresInSeconds: number
}

/**
 * S3 presigned URL을 발급받습니다.
 */
export async function getPresignedUrl(
  originName: string
): Promise<{ url: string; key: string }> {
  const response = await apiClient.post<GetPresignedUrlResponse>(
    '/s3/presigned-urls',
    {
      category: 'PROFILE',
      originName,
    } satisfies GetPresignedUrlRequest
  )

  const { url, key } = response.data
  return { url, key }
}

/**
 * Presigned URL을 사용하여 S3에 파일을 업로드합니다.
 */
export async function uploadToS3(
  presignedUrl: string,
  file: File
): Promise<void> {
  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })
}

/** 프로필 이미지만 업데이트 */
export async function updateProfileImage(
  profileImageKey: string | null
): Promise<void> {
  await apiClient.patch('/users/me', {
    profile_image_key: profileImageKey,
  })
}
