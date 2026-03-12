import { infiniteQueryOptions } from '@tanstack/react-query'
import { getWallets } from './wallet.api'
import type {
  GetWalletsParams,
  GetWalletsResponse,
} from '../model/wallet.types'

type WalletsQueryParams = Omit<GetWalletsParams, 'cursorId'>
type WalletsFetcher = (params: GetWalletsParams) => Promise<GetWalletsResponse>

export const walletKeys = {
  all: ['wallets'] as const,
  lists: () => [...walletKeys.all, 'list'] as const,
  list: (params: GetWalletsParams = {}) =>
    [...walletKeys.lists(), params] as const,
}

export function walletsInfiniteQueryOptions(
  params: WalletsQueryParams = {},
  fetcher: WalletsFetcher = getWallets
) {
  return infiniteQueryOptions({
    queryKey: walletKeys.list(params),
    queryFn: ({ pageParam }) =>
      fetcher({ ...params, cursorId: pageParam as number | undefined }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination?.has_next ? lastPage.pagination.cursorId : undefined,
    refetchOnWindowFocus: false,
  })
}
