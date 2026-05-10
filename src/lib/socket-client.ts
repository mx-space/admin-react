import { io, type Socket } from 'socket.io-client'

import { env } from '~/constants/env'

import {
  SocketEvent,
  type SocketEnvelope,
  type SocketEventName,
  type SocketEventPayload,
} from './socket-events'

const toAbsolute = (url: string): string => {
  if (!url) return window.location.origin
  if (/^https?:\/\//.test(url)) return url.replace(/\/$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${window.location.origin}${path}`.replace(/\/$/, '')
}

const gatewayURL = `${toAbsolute(env.gateway)}/admin`

type AnyListener = (payload: unknown, code?: number) => void

const listeners = new Map<SocketEventName, Set<AnyListener>>()

let socket: Socket | null = null
let messageBound = false

export const getSocket = (): Socket => {
  if (socket) return socket
  socket = io(gatewayURL, {
    transports: ['websocket'],
    withCredentials: true,
    autoConnect: false,
    timeout: 10_000,
  })
  return socket
}

const dispatch = <E extends SocketEventName>(
  type: E,
  payload: SocketEventPayload<E>,
  code?: number,
) => {
  const set = listeners.get(type)
  if (!set || set.size === 0) return
  for (const fn of set) {
    try {
      fn(payload, code)
    } catch (err) {
      console.error('[socket] listener error', type, err)
    }
  }
}

const bindMessage = (s: Socket) => {
  if (messageBound) return
  messageBound = true
  s.on('message', (raw: string | SocketEnvelope) => {
    const env =
      typeof raw === 'string'
        ? (JSON.parse(raw) as SocketEnvelope)
        : raw
    if (!env || typeof env !== 'object' || !('type' in env)) return
    dispatch(env.type, env.data, env.code)
  })
}

export const connectSocket = () => {
  const s = getSocket()
  bindMessage(s)
  if (!s.connected) s.connect()
}

export const disconnectSocket = () => {
  if (!socket) return
  socket.disconnect()
}

export const subscribeSocketEvent = <E extends SocketEventName>(
  event: E,
  handler: (payload: SocketEventPayload<E>, code?: number) => void,
): (() => void) => {
  const set = listeners.get(event) ?? new Set<AnyListener>()
  set.add(handler as AnyListener)
  listeners.set(event, set)
  return () => {
    const cur = listeners.get(event)
    if (!cur) return
    cur.delete(handler as AnyListener)
    if (cur.size === 0) listeners.delete(event)
  }
}

export { SocketEvent }
