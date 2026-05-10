import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { clearAllTableStates } from '~/atoms/table'
import { authClient } from '~/lib/auth-client'
import { queryClient } from '~/lib/query-client'
import { useAuthStore } from '~/stores'

export const useLogout = () => {
  const navigate = useNavigate()

  return useCallback(async () => {
    try {
      await authClient.signOut()
    } catch {
      // signOut 即便失败仍清本地，俾用户可重登
    }
    useAuthStore.getState().reset()
    queryClient.clear()
    clearAllTableStates()
    navigate('/login', { replace: true })
    toast.success('已退出')
  }, [navigate])
}
