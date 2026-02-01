import { apiClient } from '@/shared/api'
import type { UserInfoResponse } from '../model'

/** 내 정보 조회 */
export async function getMyInfo(): Promise<UserInfoResponse> {
  const response = await apiClient.get<UserInfoResponse>('/users/me')
  return response.data
}

/** 특정 유저 프로필 조회 */
export async function getUserProfile(
  userId: string
): Promise<UserInfoResponse> {
  const response = await apiClient.get<UserInfoResponse>(`/users/${userId}`)
  return response.data
}
