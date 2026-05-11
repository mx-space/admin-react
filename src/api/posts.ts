import { request } from '~/lib/request'
import type { PaginateResult, PostModel } from '~/models'

export interface GetPostsParams {
  page?: number
  size?: number
  select?: string
  sortBy?: string
  sortOrder?: number
  categoryIds?: string[]
  tagIds?: string[]
  status?: 'published' | 'draft' | 'hidden'
  pin?: 'pinned' | 'unpinned'
}

export interface CreatePostData {
  title: string
  text: string
  categoryId: string
  slug?: string
  tags?: string[]
  summary?: string | null
  copyright?: boolean
  isPublished?: boolean
  pin?: string | null
  pinOrder?: number
  relatedId?: string[]
  meta?: Record<string, unknown>
  draftId?: string
}

export interface UpdatePostData extends Partial<CreatePostData> {}

export const postsApi = {
  getList: (params?: GetPostsParams) =>
    request<PaginateResult<PostModel>>('/posts', { query: params }),

  getById: (id: string) => request<PostModel>(`/posts/${id}`),

  create: (data: CreatePostData) =>
    request<PostModel>('/posts', { method: 'POST', body: data }),

  update: (id: string, data: UpdatePostData) =>
    request<PostModel>(`/posts/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    request<void>(`/posts/${id}`, { method: 'DELETE' }),

  patch: (id: string, data: Partial<PostModel>) =>
    request<PostModel>(`/posts/${id}`, { method: 'PATCH', body: data }),
}
