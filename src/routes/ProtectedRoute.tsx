import { Navigate, Outlet, useLocation } from 'react-router'

import { RouteFallback } from '~/components/shared/RouteFallback'
import { useAuthBootstrap } from '~/hooks/useAuthBootstrap'
import { useAuthStore } from '~/stores'

const BYPASS_AUTH = true

export const ProtectedRoute = () => {
  useAuthBootstrap()
  const status = useAuthStore((s) => s.status)
  const location = useLocation()

  if (BYPASS_AUTH) return <Outlet />

  if (status === 'idle' || status === 'loading') return <RouteFallback />
  if (status === 'unauthenticated') {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    )
  }
  return <Outlet />
}
