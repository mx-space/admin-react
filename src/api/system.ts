import { request } from '~/lib/request'
import { BusinessError, SystemError } from '~/lib/request'

export interface AppInfoModel {
  name?: string
  author?: string
  version?: string
  homepage?: string
  [key: string]: unknown
}

export interface InitStatusModel {
  isInit: boolean
}

export interface CreateOwnerData {
  username: string
  password: string
  name?: string
  mail: string
  url?: string
  avatar?: string
  introduce?: string
}

export type InitConfigKey = 'seo' | 'url' | string

export const systemApi = {
  appInfo: (opts?: { signal?: AbortSignal }) =>
    request<AppInfoModel>('/', opts as Record<string, unknown>),

  // mx-core: GET /init returns { isInit: false } when waiting for setup;
  // 404 / 403 means already initialized.
  checkIsInit: async (): Promise<InitStatusModel> => {
    try {
      return await request<InitStatusModel>('/init')
    } catch (err) {
      const status =
        err instanceof BusinessError
          ? err.code
          : err instanceof SystemError
            ? err.status
            : undefined
      if (status === 404 || status === 403) return { isInit: true }
      throw err
    }
  },

  getInitDefaultConfigs: () =>
    request<Record<string, unknown>>('/init/configs/default'),

  patchInitConfig: (key: InitConfigKey, data: Record<string, unknown>) =>
    request<void>(`/init/configs/${key}`, { method: 'PATCH', body: data }),

  createOwner: (data: CreateOwnerData) =>
    request<void>('/init/owner', {
      method: 'POST',
      body: data as unknown as Record<string, unknown>,
    }),

  restoreFromBackup: (formData: FormData, timeout?: number) =>
    request<void>('/init/restore', { method: 'POST', body: formData, timeout }),
}
