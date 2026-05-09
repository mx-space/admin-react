import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router'

import { systemApi } from '~/api/system'
import { RouteFallback } from '~/components/shared/RouteFallback'
import { queryKeys } from '~/hooks/queries/keys'

export const SetupGuard = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.system.init(),
    queryFn: () => systemApi.checkIsInit(),
    staleTime: Infinity,
    retry: false,
  })

  if (isPending) return <RouteFallback />
  if (isError) return <Outlet />
  if (data?.initialized) return <Navigate to="/login" replace />
  return <Outlet />
}
