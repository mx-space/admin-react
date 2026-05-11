import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { toast } from 'sonner'

import { postsApi, type GetPostsParams } from '~/api/posts'
import { searchApi } from '~/api/search'
import {
  postsListFilterAtom,
  postsListSearchKeywordAtom,
  postsListSortAtom,
  type PostsListFilter,
  type PostsListSort,
} from '~/atoms/posts'
import { BACKEND_CAPS } from '~/constants/backend-caps'
import type { TableState } from '~/atoms/table'
import type { PaginateResult, PostModel } from '~/models'

import { useTableQuery } from './useTableQuery'

const POSTS_LIST_KEY = 'posts.list'

const POSTS_LIST_SELECT =
  'title id createdAt modifiedAt slug categoryId copyright tags readCount likeCount pinAt meta isPublished summary'

interface PostsListResponse {
  data: PostModel[]
  total: number
}

const buildListParams = (
  state: TableState,
  filter: PostsListFilter,
  sort: PostsListSort,
): GetPostsParams => {
  const params: GetPostsParams = {
    page: state.page,
    size: state.pageSize,
    select: POSTS_LIST_SELECT,
    sortBy: sort.sortBy,
    sortOrder: sort.order === 'asc' ? 1 : -1,
  }
  if (filter.categoryIds.length > 0) params.categoryIds = filter.categoryIds
  if (BACKEND_CAPS.postsTagIds && filter.tagIds.length > 0) {
    params.tagIds = filter.tagIds
  }
  if (BACKEND_CAPS.postsStatus && filter.status !== 'all') {
    params.status = filter.status
  }
  if (BACKEND_CAPS.postsPin && filter.pin !== 'all') {
    params.pin = filter.pin
  }
  return params
}

export const postDetailQueryKey = (id: string) =>
  ['posts', 'detail', id] as const

export const usePostsList = ({ enabled = true } = {}) => {
  const keyword = useAtomValue(postsListSearchKeywordAtom)
  const filter = useAtomValue(postsListFilterAtom)
  const sort = useAtomValue(postsListSortAtom)
  const isSearching = keyword.trim().length > 0

  return useTableQuery<PostModel>({
    key: POSTS_LIST_KEY,
    enabled,
    extraQueryKey: isSearching ? ['search', keyword] : ['list', filter, sort],
    queryFn: async (state): Promise<PostsListResponse> => {
      if (isSearching) {
        const res = (await searchApi.searchPosts({
          keyword,
          page: state.page,
          size: state.pageSize,
        })) as PaginateResult<PostModel>
        return { data: res.data, total: res.pagination.total }
      }
      const res = (await postsApi.getList(
        buildListParams(state, filter, sort),
      )) as PaginateResult<PostModel>
      return { data: res.data, total: res.pagination.total }
    },
  })
}

export const usePostDetail = (id: string | null) =>
  useQuery({
    queryKey: id ? postDetailQueryKey(id) : ['posts', 'detail', null],
    queryFn: () => postsApi.getById(id as string),
    enabled: !!id,
    staleTime: 30_000,
  })

export const usePostPatch = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<PostModel> }) =>
      postsApi.patch(id, patch),
    onSuccess: (data, vars) => {
      qc.setQueryData(postDetailQueryKey(vars.id), data)
      qc.invalidateQueries({ queryKey: ['table', POSTS_LIST_KEY] })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? '更新失败')
    },
  })
}

export const usePostDelete = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['table', POSTS_LIST_KEY] })
    },
    onError: (err: Error) => {
      toast.error(err.message ?? '删除失败')
    },
  })
}
