import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { authClient } from '~/lib/auth-client'
import { useAuthStore } from '~/stores'

import { queryKeys } from './queries/keys'

interface SessionResult {
  data?: {
    user?: unknown
  } | null
}

export const useAuthBootstrap = () => {
  const setStatus = useAuthStore((s) => s.setStatus)
  const setUser = useAuthStore((s) => s.setUser)

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: async () => {
      const res = (await authClient.getSession()) as SessionResult
      return res?.data ?? null
    },
    staleTime: 5 * 60_000,
    gcTime: 5 * 60_000,
    retry: false,
  })

  useEffect(() => {
    if (isPending) {
      setStatus('loading')
      return
    }
    if (isError || !data || !data.user) {
      setStatus('unauthenticated')
      setUser(null)
      return
    }
    setUser(data.user as Parameters<typeof setUser>[0])
  }, [data, isPending, isError, setStatus, setUser])
}
