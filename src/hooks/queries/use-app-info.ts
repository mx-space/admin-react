import { useQuery } from '@tanstack/react-query'

import { systemApi } from '~/api/system'

import { queryKeys } from './keys'

export const useAppInfoQuery = () =>
  useQuery({
    queryKey: queryKeys.system.appInfo(),
    queryFn: () => systemApi.appInfo(),
    staleTime: 5 * 60_000,
  })
