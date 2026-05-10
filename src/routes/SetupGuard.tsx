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
  // checkIsInit 已吸 404/403 之异常返 isInit:true；此处之 error 多为网络。
  // 网络故障时不可妄断，落回 setup 让用户感知。
  if (isError) return <Outlet />
  if (data?.isInit) return <Navigate to="/login" replace />
  return <Outlet />
}
