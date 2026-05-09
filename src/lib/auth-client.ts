import { passkeyClient } from '@better-auth/passkey/client'
import { usernameClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { env } from '~/constants/env'

const toAbsolute = (url: string): string => {
  if (!url) return window.location.origin
  if (/^https?:\/\//.test(url)) return url.replace(/\/$/, '')
  const path = url.startsWith('/') ? url : `/${url}`
  return `${window.location.origin}${path}`.replace(/\/$/, '')
}

const baseURL = `${toAbsolute(env.baseApi)}/auth`

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: { credentials: 'include' },
  plugins: [passkeyClient(), usernameClient()],
})
