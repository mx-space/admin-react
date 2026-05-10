import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { useLogout } from '~/hooks/useLogout'
import { useSocketEvent } from '~/hooks/useSocketEvent'
import { queryClient } from '~/lib/query-client'
import { connectSocket, disconnectSocket } from '~/lib/socket-client'
import {
  SocketEvent,
  type AdminNotificationKind,
  type AdminNotificationPayload,
  type CommentCreatePayload,
  type LinkApplyPayload,
} from '~/lib/socket-events'
import { invalidateAllResourceLists } from '~/stores/data/store'
import { useAuthStore } from '~/stores'

const TOAST_KIND: Record<AdminNotificationKind, (m: string) => void> = {
  error: (m) => toast.error(m),
  warning: (m) => toast.warning(m),
  success: (m) => toast.success(m),
  info: (m) => toast.info(m),
}

// Domain entity events route to specific resource tables in P3 (e.g. posts.injectEntity,
// posts.invalidateList, posts.removeEntity). While those tables do not yet exist, we mark
// every registered resource's lists stale and invalidate every TanStack Query under
// `['data']` so any mounted list re-runs its queryFn.
const refreshAllResourceData = () => {
  invalidateAllResourceLists()
  void queryClient.invalidateQueries({ queryKey: ['data'] })
}

export const SocketBridge = () => {
  const navigate = useNavigate()
  const logout = useLogout()
  const status = useAuthStore((s) => s.status)
  const authedRef = useRef(false)

  useEffect(() => {
    if (status === 'authenticated' && !authedRef.current) {
      authedRef.current = true
      connectSocket()
    } else if (status !== 'authenticated' && authedRef.current) {
      authedRef.current = false
      disconnectSocket()
    }
    return () => {
      if (authedRef.current) {
        authedRef.current = false
        disconnectSocket()
      }
    }
  }, [status])

  const onCommentCreate = useCallback(
    (payload: CommentCreatePayload) => {
      refreshAllResourceData()
      const body = `${payload.author}: ${payload.text}`
      toast.success('新的评论', {
        description: body,
        action: {
          label: '查看',
          onClick: () => navigate('/comments'),
        },
        duration: 10_000,
      })
    },
    [navigate],
  )

  const onPostsChanged = useCallback(() => {
    refreshAllResourceData()
  }, [])

  const onNotesChanged = useCallback(() => {
    refreshAllResourceData()
  }, [])

  const onPagesChanged = useCallback(() => {
    refreshAllResourceData()
  }, [])

  const onLinkApply = useCallback(
    (payload: LinkApplyPayload) => {
      refreshAllResourceData()
      toast.success('新的友链申请', {
        description: payload.name,
        action: {
          label: '查看',
          onClick: () => navigate('/friends?state=1'),
        },
        duration: 10_000,
      })
    },
    [navigate],
  )

  const onContentRefresh = useCallback(() => {
    refreshAllResourceData()
    toast.warning('数据已刷新')
  }, [])

  const onAdminNotification = useCallback(
    (payload: AdminNotificationPayload) => {
      if (!payload?.message) return
      const kind = TOAST_KIND[payload.type] ?? toast.info
      kind(payload.message)
    },
    [],
  )

  const onAuthFailed = useCallback(() => {
    toast.warning('Session expired')
    void logout()
  }, [logout])

  const onGatewayDisconnect = useCallback((payload: string) => {
    if (payload) toast.warning(payload)
  }, [])

  useSocketEvent(SocketEvent.COMMENT_CREATE, onCommentCreate)
  useSocketEvent(SocketEvent.POST_CREATE, onPostsChanged)
  useSocketEvent(SocketEvent.POST_UPDATE, onPostsChanged)
  useSocketEvent(SocketEvent.POST_DELETE, onPostsChanged)
  useSocketEvent(SocketEvent.NOTE_CREATE, onNotesChanged)
  useSocketEvent(SocketEvent.NOTE_UPDATE, onNotesChanged)
  useSocketEvent(SocketEvent.NOTE_DELETE, onNotesChanged)
  useSocketEvent(SocketEvent.PAGE_UPDATED, onPagesChanged)
  useSocketEvent(SocketEvent.LINK_APPLY, onLinkApply)
  useSocketEvent(SocketEvent.CONTENT_REFRESH, onContentRefresh)
  useSocketEvent(SocketEvent.ADMIN_NOTIFICATION, onAdminNotification)
  useSocketEvent(SocketEvent.AUTH_FAILED, onAuthFailed)
  useSocketEvent(SocketEvent.GATEWAY_DISCONNECT, onGatewayDisconnect)

  return null
}
