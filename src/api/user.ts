import type { UserModel } from '~/models'

import { request } from '~/lib/request'

export interface AllowLoginResponse {
  password: boolean
  passkey: boolean
  github?: boolean
  google?: boolean
  [key: string]: boolean | undefined
}

export const userApi = {
  getOwner: () => request<UserModel>('/owner'),
  getAllowLogin: () => request<AllowLoginResponse>('/owner/allow-login'),
}
