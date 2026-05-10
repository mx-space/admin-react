import { useEffect } from 'react'
import { toast } from 'sonner'

import { useLogout } from '~/hooks/useLogout'
import { setUnauthorizedHandler } from '~/lib/auth-events'

export const AuthErrorBridge = () => {
  const logout = useLogout()

  useEffect(() => {
    setUnauthorizedHandler(() => {
      toast.warning('登录已失效，请重新登录')
      void logout()
    })
    return () => setUnauthorizedHandler(null)
  }, [logout])

  return null
}
