import { request } from '~/lib/request'
import type { CategoryModel, TagModel } from '~/models'

export interface GetCategoriesParams {
  type?: 'Category' | 'Tag' | 'tag'
}

export interface CreateCategoryData {
  name: string
  slug: string
  type?: number
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

export const categoryApi = {
  getList: (params?: GetCategoriesParams) =>
    request<CategoryModel[]>('/categories', { query: params }),

  getById: (id: string) => request<CategoryModel>(`/categories/${id}`),

  create: (data: CreateCategoryData) =>
    request<CategoryModel>('/categories', { method: 'POST', body: data }),

  update: (id: string, data: UpdateCategoryData) =>
    request<CategoryModel>(`/categories/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) =>
    request<void>(`/categories/${id}`, { method: 'DELETE' }),

  getTags: () =>
    request<TagModel[]>('/categories', { query: { type: 'tag' } }),
}
