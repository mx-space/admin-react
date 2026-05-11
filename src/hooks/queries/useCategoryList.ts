import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import { categoryApi } from '~/api/category'
import type { CategoryModel } from '~/models'

export const categoryListQueryKey = ['categories', 'list'] as const

export const useCategoryList = (): UseQueryResult<CategoryModel[]> =>
  useQuery({
    queryKey: categoryListQueryKey,
    queryFn: () => categoryApi.getList(),
    staleTime: 60_000,
  })
