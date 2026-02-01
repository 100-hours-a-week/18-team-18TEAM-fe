import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getMyLatestCard } from './qr-share.api'

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
