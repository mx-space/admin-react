import { useEffect } from 'react'

import { subscribeSocketEvent } from '~/lib/socket-client'
import type {
  SocketEventName,
  SocketEventPayload,
} from '~/lib/socket-events'

export const useSocketEvent = <E extends SocketEventName>(
  event: E,
  handler: (payload: SocketEventPayload<E>, code?: number) => void,
) => {
  useEffect(() => {
    const off = subscribeSocketEvent(event, handler)
    return off
  }, [event, handler])
}
