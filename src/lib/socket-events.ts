export const SocketEvent = {
  GATEWAY_CONNECT: 'GATEWAY_CONNECT',
  GATEWAY_DISCONNECT: 'GATEWAY_DISCONNECT',

  VISITOR_ONLINE: 'VISITOR_ONLINE',
  VISITOR_OFFLINE: 'VISITOR_OFFLINE',

  AUTH_FAILED: 'AUTH_FAILED',

  COMMENT_CREATE: 'COMMENT_CREATE',

  POST_CREATE: 'POST_CREATE',
  POST_UPDATE: 'POST_UPDATE',
  POST_DELETE: 'POST_DELETE',

  NOTE_CREATE: 'NOTE_CREATE',
  NOTE_UPDATE: 'NOTE_UPDATE',
  NOTE_DELETE: 'NOTE_DELETE',

  PAGE_UPDATED: 'PAGE_UPDATED',

  SAY_CREATE: 'SAY_CREATE',
  SAY_UPDATE: 'SAY_UPDATE',
  SAY_DELETE: 'SAY_DELETE',

  LINK_APPLY: 'LINK_APPLY',

  DANMAKU_CREATE: 'DANMAKU_CREATE',

  CONTENT_REFRESH: 'CONTENT_REFRESH',
  IMAGE_REFRESH: 'IMAGE_REFRESH',
  IMAGE_FETCH: 'IMAGE_FETCH',

  ADMIN_NOTIFICATION: 'ADMIN_NOTIFICATION',
} as const

export type SocketEventName = (typeof SocketEvent)[keyof typeof SocketEvent]

export type AdminNotificationKind = 'error' | 'warning' | 'success' | 'info'

export interface AdminNotificationPayload {
  type: AdminNotificationKind
  message: string
}

export interface CommentCreatePayload {
  author: string
  text: string
  [key: string]: unknown
}

export interface LinkApplyPayload {
  name: string
  [key: string]: unknown
}

// Entity payload narrowing — domain events that carry full or partial entity bodies.
// `id` is the only field required by the engine; `modified` is consulted by the
// universal version guard when present.
export interface EntityIdPayload {
  id: string
  [key: string]: unknown
}

export interface EntityUpdatePayload {
  id: string
  modified?: number | string
  [key: string]: unknown
}

export interface SocketEventPayloadMap {
  [SocketEvent.GATEWAY_CONNECT]: unknown
  [SocketEvent.GATEWAY_DISCONNECT]: string
  [SocketEvent.VISITOR_ONLINE]: unknown
  [SocketEvent.VISITOR_OFFLINE]: unknown
  [SocketEvent.AUTH_FAILED]: unknown
  [SocketEvent.COMMENT_CREATE]: CommentCreatePayload
  [SocketEvent.POST_CREATE]: EntityUpdatePayload
  [SocketEvent.POST_UPDATE]: EntityUpdatePayload
  [SocketEvent.POST_DELETE]: EntityIdPayload
  [SocketEvent.NOTE_CREATE]: EntityUpdatePayload
  [SocketEvent.NOTE_UPDATE]: EntityUpdatePayload
  [SocketEvent.NOTE_DELETE]: EntityIdPayload
  [SocketEvent.PAGE_UPDATED]: EntityUpdatePayload
  [SocketEvent.SAY_CREATE]: EntityUpdatePayload
  [SocketEvent.SAY_UPDATE]: EntityUpdatePayload
  [SocketEvent.SAY_DELETE]: EntityIdPayload
  [SocketEvent.LINK_APPLY]: LinkApplyPayload
  [SocketEvent.DANMAKU_CREATE]: unknown
  [SocketEvent.CONTENT_REFRESH]: unknown
  [SocketEvent.IMAGE_REFRESH]: unknown
  [SocketEvent.IMAGE_FETCH]: unknown
  [SocketEvent.ADMIN_NOTIFICATION]: AdminNotificationPayload
}

export type SocketEventPayload<E extends SocketEventName> =
  SocketEventPayloadMap[E]

export interface SocketEnvelope<E extends SocketEventName = SocketEventName> {
  type: E
  data: SocketEventPayload<E>
  code?: number
}
