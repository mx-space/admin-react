import { request } from '~/lib/request'
import type { PaginateResult, PostModel } from '~/models'

export interface SearchParams {
  keyword: string
  page?: number
  size?: number
}

export const searchApi = {
  searchPosts: (params: SearchParams) =>
    request<PaginateResult<PostModel>>('/search/post', { query: params }),
}
