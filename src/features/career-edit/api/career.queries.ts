import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { qrShareKeys } from '@/features/qr-share'
import type { CareerFormData } from '../model'
import {
  getCareers,
  getCareersByUserId,
  getCareer,
  createCareer,
  updateCareer,
  deleteCareer,
  type CareerResponse,
} from './career.api'

/** 쿼리 키 */
export const careerKeys = {
  all: ['careers'] as const,
  lists: () => [...careerKeys.all, 'list'] as const,
  list: () => [...careerKeys.lists()] as const,
  listByUser: (userId: string) =>
    [...careerKeys.lists(), 'user', userId] as const,
  details: () => [...careerKeys.all, 'detail'] as const,
  detail: (id: string) => [...careerKeys.details(), id] as const,
}

/** 내 경력 전체 조회 훅 */
export function useCareers() {
  return useQuery({
    queryKey: careerKeys.list(),
    queryFn: async () => {
      const response = await getCareers()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/** 특정 유저의 경력 전체 조회 훅 */
export function useUserCareers(
  userId: string | undefined,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: careerKeys.listByUser(userId || ''),
    queryFn: async () => {
      const response = await getCareersByUserId(userId!)
      return response.data
    },
    enabled: options?.enabled !== false && Boolean(userId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/** 경력 단일 조회 훅 */
export function useCareer(cardId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: careerKeys.detail(cardId),
    queryFn: () => getCareer(cardId),
    enabled: options?.enabled !== false && Boolean(cardId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/** 경력 생성 mutation 훅 */
export function useCreateCareer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CareerFormData) => createCareer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: qrShareKeys.myLatestCard() })
    },
  })
}

/** 경력 수정 mutation 훅 */
export function useUpdateCareer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: string; data: CareerFormData }) =>
      updateCareer(cardId, data),
    onSuccess: (_, { cardId }) => {
      queryClient.invalidateQueries({ queryKey: careerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: careerKeys.detail(cardId) })
      queryClient.invalidateQueries({ queryKey: qrShareKeys.myLatestCard() })
    },
  })
}

/** 경력 삭제 mutation 훅 */
export function useDeleteCareer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (cardId: string) => deleteCareer(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: careerKeys.lists() })
      queryClient.invalidateQueries({ queryKey: qrShareKeys.myLatestCard() })
    },
  })
}

export type { CareerResponse }
