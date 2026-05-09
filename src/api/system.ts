import { request } from '~/lib/request'

export interface AppInfoModel {
  name?: string
  author?: string
  version?: string
  homepage?: string
  [key: string]: unknown
}

export interface InitStatusModel {
  initialized: boolean
}

export const systemApi = {
  appInfo: () => request<AppInfoModel>('/'),
  checkIsInit: () => request<InitStatusModel>('/init'),
}
