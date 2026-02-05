import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import type { ProfileData } from '@/shared'
import { getMyLatestCard } from './qr-share.api'
import type { CardData } from '../model'

/** 쿼리 키 */
export const qrShareKeys = {
  all: ['qr-share'] as const,
  myLatestCard: () => [...qrShareKeys.all, 'my-latest-card'] as const,
}

/** 내 최신 명함 조회 훅 */
export function useMyLatestCard() {
  return useQuery({
    queryKey: qrShareKeys.myLatestCard(),
    queryFn: async () => {
      try {
        const response = await getMyLatestCard()
        // TanStack Query v5는 undefined 반환 불가, null로 변환
        return response.data ?? null
      } catch (error) {
        // 404 에러(경력 없음)는 null로 처리
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null
        }
        throw error
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/** CardData를 ProfileData로 변환 */
export function toProfileDataFromCard(
  cardData: CardData,
  profileImageUrl?: string
): ProfileData {
  return {
    name: cardData.name,
    email: cardData.email,
    phone: cardData.phone_number,
    tel: cardData.lined_number,
    company: cardData.company,
    department: cardData.department,
    position: cardData.position,
    avatarSrc: profileImageUrl || null,
  }
}
