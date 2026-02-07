import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { ProfileData } from '@/shared'
import { getMyInfo, getUserProfile } from './user.api'
import { getCareersByUserId } from '@/features/career-edit/api/career.api'
import type { UserInfo } from '../model'

/** 쿼리 키 */
export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  profile: (userId: string) => [...userKeys.all, 'profile', userId] as const,
}

/** UserInfo를 ProfileData로 변환 */
function toProfileData(userInfo: UserInfo): ProfileData {
  return {
    name: userInfo.name,
    email: userInfo.email,
    phone: userInfo.phone_number,
    tel: userInfo.lined_number,
    company: userInfo.company,
    department: userInfo.department,
    position: userInfo.position,
    avatarSrc: userInfo.profile_image_url || null,
  }
}

/** 내 정보 조회 훅 */
export function useMyInfo() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const response = await getMyInfo()
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  })
}

/** 내 정보를 ProfileData 형태로 조회하는 훅 */
export function useMyProfile() {
  const query = useMyInfo()

  const profileData = React.useMemo(
    () => (query.data ? toProfileData(query.data) : undefined),
    [query.data]
  )

  return {
    ...query,
    data: profileData,
    userInfo: query.data,
  }
}

/** 내 정보 캐시 무효화 훅 */
export function useInvalidateMyInfo() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: userKeys.me() })
  }
}

/** 특정 유저 프로필 조회 훅 (이미지는 users API, 나머지는 cards API) */
export function useUserProfile(
  userId: string,
  options?: { enabled?: boolean }
) {
  // 프로필 조회 (이미지용)
  const profileQuery = useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: async () => {
      const response = await getUserProfile(userId)
      return response.data
    },
    enabled: options?.enabled !== false && Boolean(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // 카드 조회 (나머지 정보용)
  const cardQuery = useQuery({
    queryKey: [...userKeys.all, 'cards', userId],
    queryFn: async () => {
      const response = await getCareersByUserId(userId)
      return response.data
    },
    enabled: options?.enabled !== false && Boolean(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const latestCard = cardQuery.data?.[0]

  const profileData = React.useMemo(() => {
    if (!latestCard) return undefined
    return {
      name: latestCard.name || '',
      email: latestCard.email,
      phone: latestCard.phone_number,
      tel: latestCard.lined_number || '',
      company: latestCard.company || '',
      department: latestCard.department || '',
      position: latestCard.position || '',
      avatarSrc: profileQuery.data?.profile_image_url || null,
    } as ProfileData
  }, [latestCard, profileQuery.data])

  // userInfo에 description도 cards에서 가져온 값으로 덮어씀
  const userInfo = React.useMemo(() => {
    if (!profileQuery.data) return undefined
    return {
      ...profileQuery.data,
      description: latestCard?.description || profileQuery.data.description,
    } as UserInfo
  }, [profileQuery.data, latestCard])

  return {
    ...profileQuery,
    data: profileData,
    userInfo,
    isLoading: profileQuery.isLoading || cardQuery.isLoading,
    isError: profileQuery.isError || cardQuery.isError,
  }
}
