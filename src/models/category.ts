export enum CategoryType {
  Category = 0,
  Tag = 1,
}

export interface CategoryModel {
  id: string
  createdAt: string
  type: CategoryType
  count: number
  slug: string
  name: string
}

export interface TagModel {
  count: number
  name: string
}
