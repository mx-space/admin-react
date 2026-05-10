import { simpleCamelcaseKeys } from '@mx-space/api-client'
import { ofetch } from 'ofetch'

import { env } from '~/constants/env'

import { fireUnauthorized } from './auth-events'

export class BusinessError extends Error {
  readonly code: number
  readonly raw?: unknown
  constructor(code: number, message: string, raw?: unknown) {
    super(message)
    this.name = 'BusinessError'
    this.code = code
    this.raw = raw
  }
}

export class SystemError extends Error {
  readonly status?: number
  readonly raw?: unknown
  constructor(message: string, status?: number, raw?: unknown) {
    super(message)
    this.name = 'SystemError'
    this.status = status
    this.raw = raw
  }
}

const UUID_KEY = 'uuid'

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export const getOrCreateClientUUID = (): string => {
  try {
    const existing = localStorage.getItem(UUID_KEY)
    if (existing) return existing
    const next = generateUUID()
    localStorage.setItem(UUID_KEY, next)
    return next
  } catch {
    return generateUUID()
  }
}

const transformResponse = <T>(input: unknown): T => {
  if (input == null) return input as T
  const camelized = simpleCamelcaseKeys<unknown>(input)
  if (
    camelized != null &&
    typeof camelized === 'object' &&
    !Array.isArray(camelized) &&
    'data' in (camelized as Record<string, unknown>) &&
    Array.isArray((camelized as { data: unknown }).data)
  ) {
    const obj = camelized as Record<string, unknown>
    const informativeSiblings = Object.keys(obj).filter(
      (k) => k !== 'data' && obj[k] != null,
    )
    if (informativeSiblings.length === 0) {
      return obj.data as T
    }
  }
  return camelized as T
}

const baseURL = env.baseApi || '/api/v2'

export const request = ofetch.create({
  baseURL,
  credentials: 'include',
  retry: 0,
  onRequest({ options }) {
    const headers = new Headers(options.headers)
    headers.set('x-uuid', getOrCreateClientUUID())
    options.headers = headers
    const method = (options.method ?? 'GET').toString().toUpperCase()
    if (method === 'GET' && typeof options.query === 'object') {
      ;(options.query as Record<string, unknown>)._t = Date.now()
    } else if (method === 'GET') {
      options.query = { _t: Date.now() }
    }
  },
  onResponse({ response }) {
    response._data = transformResponse(response._data)
  },
  onResponseError({ response }) {
    const data = response._data as
      | { code?: number; message?: string }
      | undefined
    if (response.status === 401 || data?.code === 401) {
      fireUnauthorized()
    }
    if (response.status >= 500 || !data) {
      throw new SystemError(
        data?.message ?? 'Network error',
        response.status,
        data,
      )
    }
    throw new BusinessError(
      data.code ?? response.status,
      data.message ?? 'Unknown error',
      data,
    )
  },
})
