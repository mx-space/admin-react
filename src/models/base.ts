import type { Pager, PaginateResult } from '@mx-space/api-client'

export type { Pager, PaginateResult }

export interface Image {
  height: number
  width: number
  type: string
  accent?: string
  src: string
  blurHash?: string
}

export interface Count {
  read: number
  like: number
}
